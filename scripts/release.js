// tinyexec and verkit are staged with the validated artifacts so the publishing job does
// not need to install workspace dependencies while it has OIDC access.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const {xSync} = require('tinyexec')
// The legacy ESLint resolver does not support verkit's package exports.
const {isValid, normalizeFull, compare, isPrerelease, tryParse, increment} = require('verkit') // eslint-disable-line import/no-unresolved

const root = path.resolve(__dirname, '..')
const registry = 'https://registry.npmjs.org/'

function isReleaseVersion(version) {
  // verkit accepts v prefixes and whitespace; releases require canonical spelling.
  if (typeof version !== 'string' || !isValid(version) || normalizeFull(version) !== version)
    return false
  // verkit can round large numeric prerelease strings during comparison. Fail closed.
  return (tryParse(version).prerelease || []).every(
    (identifier) => !/^\d+$/.test(identifier) || Number.isSafeInteger(Number(identifier))
  )
}

function releaseTag(version) {
  return isPrerelease(version) ? 'next' : 'latest'
}

function run(command, args, options = {}) {
  return xSync(command, args, {
    throwOnError: true,
    nodePath: false,
    nodeOptions: {cwd: root, ...options}
  }).stdout.trim()
}

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'))
}

function packages(directory = root) {
  return fs
    .readdirSync(path.join(directory, 'packages'))
    .sort()
    .map((name) => {
      const location = path.join(directory, 'packages', name)
      return {location, ...readJson(path.join(location, 'package.json'))}
    })
    .filter((pkg) => !pkg.private)
}

function releaseNotes(content, version) {
  const headings = [...content.matchAll(/^## (.+)$/gm)]
  const index = headings.findIndex((match) => match[1].startsWith(`${version} (`))
  if (
    index === -1 ||
    headings.filter((match) => match[1].startsWith(`${version} (`)).length !== 1
  ) {
    throw new Error(`Expected exactly one changelog section for ${version}`)
  }
  return content
    .slice(
      headings[index].index + headings[index][0].length,
      index + 1 < headings.length ? headings[index + 1].index : content.length
    )
    .trim()
}

function validate(version, directory = root) {
  if (!isReleaseVersion(version))
    throw new Error(
      'Use a canonical SemVer version with safe-integer numeric prerelease identifiers'
    )
  if (readJson(path.join(directory, 'package.json')).version !== version) {
    throw new Error(`Root package.json does not match ${version}`)
  }
  const list = packages(directory)
  if (!list.length) throw new Error('No public packages found')
  const names = new Set(list.map((pkg) => pkg.name))
  list.forEach((pkg) => {
    if (pkg.version !== version) throw new Error(`${pkg.name} does not match ${version}`)
    ;['dependencies', 'devDependencies', 'optionalDependencies'].forEach((field) => {
      Object.entries(pkg[field] || {}).forEach(([name, range]) => {
        if (names.has(name) && range !== version) {
          throw new Error(`${pkg.name}: ${name} must use exact version ${version}`)
        }
      })
    })
    // Peer ranges are intentionally not rewritten during release preparation.
  })
  releaseNotes(fs.readFileSync(path.join(directory, 'changelog.md'), 'utf8'), version)
  return list
}

function bumpVersion(bump, directory = root) {
  if (
    !['patch', 'minor', 'major', 'prerelease', 'prepatch', 'preminor', 'premajor'].includes(bump)
  ) {
    throw new Error('Unsupported version increment')
  }
  const rootFilename = path.join(directory, 'package.json')
  const manifest = readJson(rootFilename)
  const list = validate(manifest.version, directory)
  const version = increment(manifest.version, bump, {identifier: 'alpha'})
  if (!isReleaseVersion(version)) throw new Error('Invalid incremented release version')
  const filename = path.join(directory, 'changelog.md')
  const content = fs.readFileSync(filename, 'utf8')
  const heading = '## Next (version and date will be generated, add changes below)'
  if (content.split(heading).length !== 2) throw new Error('Expected one Next changelog heading')
  const writeJson = (location, value) =>
    fs.writeFileSync(location, `${JSON.stringify(value, null, 2)}\n`)
  list.forEach(({location, ...pkg}) => {
    pkg.version = version
    ;['dependencies', 'devDependencies', 'optionalDependencies'].forEach((field) => {
      Object.keys(pkg[field] || {}).forEach((name) => {
        if (list.some((entry) => entry.name === name)) pkg[field][name] = version
      })
    })
    writeJson(path.join(location, 'package.json'), pkg)
    const readme = path.join(location, 'readme.md')
    if (fs.existsSync(readme)) {
      fs.writeFileSync(
        readme,
        fs.readFileSync(readme, 'utf8').split(`?v=v${manifest.version}`).join(`?v=v${version}`)
      )
    }
  })
  writeJson(rootFilename, {...manifest, version})
  fs.writeFileSync(
    filename,
    content.replace(
      heading,
      `${heading}\n\n## ${version} (${new Date().toISOString().slice(0, 10)})`
    )
  )
  validate(version, directory)
  return version
}

function prepare(bump) {
  if (run('git', ['branch', '--show-current']) !== 'master')
    throw new Error('Prepare releases from master')
  if (run('git', ['status', '--porcelain'])) throw new Error('Working tree must be clean')
  bumpVersion(bump)
}

function integrity(filename) {
  return `sha512-${crypto.createHash('sha512').update(fs.readFileSync(filename)).digest('base64')}`
}

function pack(version, destination) {
  const list = validate(version)
  fs.mkdirSync(destination, {recursive: true})
  if (fs.readdirSync(destination).length) throw new Error('Artifact directory must be empty')
  const manifest = {
    version,
    commit: run('git', ['rev-parse', 'HEAD']),
    packages: list.map((pkg) => {
      if (!fs.existsSync(path.join(pkg.location, 'dist')))
        throw new Error(`Build ${pkg.name} first`)
      const result = JSON.parse(
        run(
          'npm',
          [
            'pack',
            '--json',
            '--ignore-scripts',
            '--workspaces=false',
            '--pack-destination',
            destination
          ],
          {cwd: pkg.location}
        )
      )[0]
      return {
        name: pkg.name,
        filename: result.filename,
        integrity: integrity(path.join(destination, result.filename))
      }
    })
  }
  // Preserve both exact lockfile-installed, dependency-free runtime packages.
  ;['tinyexec', 'verkit'].forEach((name) => {
    fs.cpSync(
      path.dirname(require.resolve(`${name}/package.json`)),
      path.join(destination, 'node_modules', name),
      {recursive: true}
    )
  })
  fs.writeFileSync(
    path.join(destination, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  )
  fs.writeFileSync(
    path.join(destination, 'release-notes.md'),
    `${releaseNotes(fs.readFileSync(path.join(root, 'changelog.md'), 'utf8'), version)}\n`
  )
}

function checkArtifacts(manifest, version, commit, list, destination) {
  if (manifest.version !== version || manifest.commit !== commit)
    throw new Error('Artifact version/commit mismatch')
  const expected = list.map((pkg) => pkg.name).sort()
  const actual = manifest.packages.map((pkg) => pkg.name).sort()
  if (JSON.stringify(actual) !== JSON.stringify(expected))
    throw new Error('Artifact package list mismatch')
  manifest.packages.forEach((pkg) => {
    if (path.basename(pkg.filename) !== pkg.filename || !pkg.filename.endsWith('.tgz')) {
      throw new Error('Invalid artifact filename')
    }
    if (integrity(path.join(destination, pkg.filename)) !== pkg.integrity) {
      throw new Error(`Artifact integrity mismatch: ${pkg.name}`)
    }
  })
}

function publishedIntegrity(name, version, destination) {
  const result = xSync(
    'npm',
    ['view', `${name}@${version}`, 'dist', '--json', '--registry', registry],
    {nodePath: false, nodeOptions: {cwd: destination}}
  )
  if (result.exitCode !== 0) {
    // Do not interpret network errors, authentication failures, etc. as an absent version.
    let error
    try {
      error = JSON.parse(result.stdout).error
    } catch (ignored) {
      /* handled below */
    }
    if (error && error.code === 'E404') return null
    throw new Error(`Registry lookup failed for ${name}: ${result.stderr}`)
  }
  const dist = JSON.parse(result.stdout)
  if (!dist.integrity) throw new Error(`Missing registry integrity for ${name}@${version}`)
  return dist.integrity
}

function publishArtifacts(manifest, lookup, upload) {
  // Check every existing package before publishing any missing ones.
  const existing = new Set()
  manifest.packages.forEach((pkg) => {
    const remote = lookup(pkg.name, manifest.version)
    if (remote && remote !== pkg.integrity)
      throw new Error(`Published artifact differs: ${pkg.name}@${manifest.version}`)
    if (remote) existing.add(pkg.name)
  })
  manifest.packages.forEach((pkg) => {
    if (!existing.has(pkg.name)) upload(pkg)
  })
  // Verify the registry accepted every archive before creating a GitHub release.
  manifest.packages.forEach((pkg) => {
    if (lookup(pkg.name, manifest.version) !== pkg.integrity)
      throw new Error(`Published integrity mismatch: ${pkg.name}`)
  })
}

function assertTagNotNewer(current, version) {
  if (current === undefined) return
  if (!isReleaseVersion(current)) throw new Error(`Cannot compare existing npm tag ${current}`)
  if (compare(current, version) > 0) {
    throw new Error(`Refusing to move npm tag backwards from ${current} to ${version}`)
  }
}

function publish(version, destination) {
  if (process.env.GITHUB_ACTIONS !== 'true' || !process.env.ACTIONS_ID_TOKEN_REQUEST_URL) {
    throw new Error('Publishing is only allowed in GitHub Actions with OIDC enabled')
  }
  const list = validate(version)
  const manifest = readJson(path.join(destination, 'manifest.json'))
  checkArtifacts(manifest, version, run('git', ['rev-parse', 'HEAD']), list, destination)
  const tag = releaseTag(version)
  manifest.packages.forEach((pkg) => {
    const tags = JSON.parse(
      run('npm', ['view', pkg.name, 'dist-tags', '--json', '--registry', registry], {
        cwd: destination
      })
    )
    assertTagNotNewer(tags[tag], version)
  })
  publishArtifacts(
    manifest,
    (name, value) => publishedIntegrity(name, value, destination),
    (pkg) => {
      run(
        'npm',
        [
          'publish',
          path.join(destination, pkg.filename),
          '--access',
          'public',
          '--tag',
          tag,
          '--provenance',
          '--ignore-scripts',
          '--registry',
          registry
        ],
        {cwd: destination, stdio: 'inherit'}
      )
    }
  )
}

if (require.main === module) {
  try {
    const [command, value, destination] = process.argv.slice(2)
    const directory = path.resolve(destination || path.join(root, 'tmp', 'release'))
    if (command === 'prepare') prepare(value)
    else if (command === 'validate') validate(value)
    else if (command === 'pack') pack(value, directory)
    else if (command === 'publish') publish(value, directory)
    else
      throw new Error(
        'Usage: node scripts/release.js prepare|validate|pack|publish <version-or-bump> [artifact-directory]'
      )
  } catch (error) {
    console.error(error.message) // eslint-disable-line no-console
    process.exitCode = 1
  }
}

module.exports = {
  bumpVersion,
  validate,
  releaseTag,
  releaseNotes,
  integrity,
  checkArtifacts,
  publishArtifacts,
  assertTagNotNewer
}
