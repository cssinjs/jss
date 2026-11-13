const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const {test} = require('node:test') // eslint-disable-line import/no-unresolved
const {xSync} = require('tinyexec')
const {
  validate,
  releaseNotes,
  integrity,
  checkArtifacts,
  publishArtifacts,
  assertTagNotNewer
} = require('./release')

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'jss-release-test-'))
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}))
  const write = (filename, content) => {
    const location = path.join(directory, filename)
    fs.mkdirSync(path.dirname(location), {recursive: true})
    fs.writeFileSync(location, typeof content === 'string' ? content : JSON.stringify(content))
  }
  write('lerna.json', {version: '1.2.3'})
  write(
    'changelog.md',
    '## Next\n\n## 1.2.3 (2026-01-01)\n\nRelease notes\n\n## 1.2.2 (2025-01-01)\nOld notes\n'
  )
  write('packages/a/package.json', {name: 'a', version: '1.2.3', dependencies: {b: '1.2.3'}})
  write('packages/b/package.json', {name: 'b', version: '1.2.3'})
  return {directory, write}
}

test('validates a synchronized release and extracts only its changelog section', (t) => {
  const {directory} = fixture(t)
  assert.strictEqual(validate('1.2.3', directory).length, 2)
  assert.strictEqual(
    releaseNotes(fs.readFileSync(path.join(directory, 'changelog.md'), 'utf8'), '1.2.3'),
    'Release notes'
  )
})

test('rejects invalid input, unsynchronized versions, and missing changelog sections', (t) => {
  const {directory, write} = fixture(t)
  assert.throws(() => validate('1.2.3; echo unsafe', directory), /stable version/)
  assert.throws(() => validate('1.2.4', directory), /lerna.json/)
  write('packages/b/package.json', {name: 'b', version: '1.2.2'})
  assert.throws(() => validate('1.2.3', directory), /b does not match/)
  write('packages/b/package.json', {name: 'b', version: '1.2.3'})
  write('changelog.md', '## Next\n')
  assert.throws(() => validate('1.2.3', directory), /changelog section/)
  assert.throws(
    () => releaseNotes('## 1.2.3 (today)\n## 1.2.3 (yesterday)', '1.2.3'),
    /exactly one/
  )
})

test('requires exact workspace dependencies but preserves peer ranges', (t) => {
  const {directory, write} = fixture(t)
  write('packages/a/package.json', {name: 'a', version: '1.2.3', dependencies: {b: '^1.2.3'}})
  assert.throws(() => validate('1.2.3', directory), /exact version/)
  write('packages/a/package.json', {name: 'a', version: '1.2.3', peerDependencies: {b: '^1.0.0'}})
  assert.strictEqual(validate('1.2.3', directory).length, 2)
})

test('binds artifacts to the version, source commit, package list, and sha512', (t) => {
  const {directory, write} = fixture(t)
  write('a.tgz', 'archive-a')
  write('b.tgz', 'archive-b')
  const manifest = {
    version: '1.2.3',
    commit: 'commit',
    packages: ['a', 'b'].map((name) => ({
      name,
      filename: `${name}.tgz`,
      integrity: integrity(path.join(directory, `${name}.tgz`))
    }))
  }
  const list = validate('1.2.3', directory)
  checkArtifacts(manifest, '1.2.3', 'commit', list, directory)
  assert.throws(
    () => checkArtifacts(manifest, '1.2.4', 'commit', list, directory),
    /version\/commit/
  )
  assert.throws(
    () => checkArtifacts(manifest, '1.2.3', 'other', list, directory),
    /version\/commit/
  )
  assert.throws(
    () =>
      checkArtifacts(
        {...manifest, packages: manifest.packages.slice(1)},
        '1.2.3',
        'commit',
        list,
        directory
      ),
    /package list/
  )
  write('a.tgz', 'modified')
  assert.throws(
    () => checkArtifacts(manifest, '1.2.3', 'commit', list, directory),
    /integrity mismatch/
  )
  manifest.packages[0].filename = '../a.tgz'
  assert.throws(
    () => checkArtifacts(manifest, '1.2.3', 'commit', list, directory),
    /Invalid artifact/
  )
})

test('resumes partial publication, skips identical archives, and verifies uploads', () => {
  const manifest = {
    version: '1.2.3',
    packages: [
      {name: 'a', integrity: 'a'},
      {name: 'b', integrity: 'b'}
    ]
  }
  const registry = new Map([['a', 'a']])
  const uploads = []
  publishArtifacts(
    manifest,
    (name) => registry.get(name),
    (pkg) => {
      uploads.push(pkg.name)
      registry.set(pkg.name, pkg.integrity)
    }
  )
  assert.deepStrictEqual(uploads, ['b'])
  publishArtifacts(
    manifest,
    (name) => registry.get(name),
    () => assert.fail('must not republish')
  )
})

test('checks all conflicts before uploading and fails closed on lookup errors', () => {
  const manifest = {
    version: '1.2.3',
    packages: [
      {name: 'a', integrity: 'a'},
      {name: 'b', integrity: 'b'}
    ]
  }
  const upload = () => assert.fail('must not publish')
  assert.throws(
    () => publishArtifacts(manifest, (name) => (name === 'b' ? 'different' : null), upload),
    /differs/
  )
  assert.throws(
    () =>
      publishArtifacts(
        manifest,
        () => {
          throw new Error('Network failure')
        },
        upload
      ),
    /Network failure/
  )
  assert.throws(
    () =>
      publishArtifacts(
        manifest,
        () => null,
        () => {}
      ),
    /integrity mismatch/
  )
})

test('never moves a newer npm tag backwards, including prereleases', () => {
  assertTagNotNewer(undefined, '1.2.3')
  assertTagNotNewer('1.2.3', '1.2.3')
  assertTagNotNewer('1.2.3-alpha.9', '1.2.3-alpha.10')
  assertTagNotNewer('1.2.3-rc.9', '1.2.3')
  assertTagNotNewer('1.2.3', '1.2.4-alpha.0')
  assert.throws(() => assertTagNotNewer('1.3.0', '1.2.9'), /backwards/)
  assert.throws(() => assertTagNotNewer('1.2.3', '1.2.3-alpha.0'), /backwards/)
  assert.throws(() => assertTagNotNewer('1.2.3-beta.0', '1.2.3-alpha.10'), /backwards/)
  assert.throws(() => assertTagNotNewer('invalid', '1.2.3'), /Cannot compare/)
})

test('runs with staged tinyexec without installing workspace dependencies', (t) => {
  const {directory} = fixture(t)
  const script = path.join(directory, 'scripts', 'release.js')
  fs.mkdirSync(path.dirname(script))
  fs.copyFileSync(path.join(__dirname, 'release.js'), script)
  const modules = path.join(directory, 'runtime', 'node_modules')
  fs.cpSync(
    path.dirname(require.resolve('tinyexec/package.json')),
    path.join(modules, 'tinyexec'),
    {
      recursive: true
    }
  )
  const result = xSync(process.execPath, [script, 'validate', '1.2.3'], {
    throwOnError: true,
    nodeOptions: {cwd: directory, env: {NODE_PATH: modules}}
  })
  assert.strictEqual(result.exitCode, 0)
})

test('refuses local publication without GitHub OIDC', () => {
  const result = xSync(process.execPath, [path.join(__dirname, 'release.js'), 'publish', '1.2.3'], {
    nodeOptions: {env: {GITHUB_ACTIONS: '', ACTIONS_ID_TOKEN_REQUEST_URL: ''}}
  })
  assert.strictEqual(result.exitCode, 1)
  assert.match(result.stderr, /only allowed in GitHub Actions/)
})
