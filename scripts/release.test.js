const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const vm = require('vm')
const {test} = require('node:test') // eslint-disable-line import/no-unresolved
const {xSync} = require('tinyexec')
const {
  validate,
  releaseTag,
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
  ;[
    undefined,
    null,
    123,
    '',
    'v1.2.3',
    '=1.2.3',
    ' 1.2.3',
    '1.2.3\n',
    '01.2.3',
    '1.2',
    '1.2.3-dev.01',
    '1.2.3-dev.9007199254740992',
    '1.2.3; echo unsafe'
  ].forEach((version) => {
    assert.throws(() => validate(version, directory), /canonical SemVer/)
  })
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

test('accepts arbitrary prereleases and distinguishes hyphens in build metadata', (t) => {
  const {directory, write} = fixture(t)
  ;[
    '1.2.3-dev.0',
    '1.2.3-dev.9007199254740991',
    '1.2.3-dev.9007199254740993a',
    '1.2.3-dev.1e16',
    '1.2.3-preview.feature.10+build-1',
    '1.2.3+build-with-hyphens'
  ].forEach((version) => {
    write('lerna.json', {version})
    write('packages/a/package.json', {name: 'a', version, dependencies: {b: version}})
    write('packages/b/package.json', {name: 'b', version})
    write('changelog.md', `## ${version} (2026-01-01)\n\nRelease notes\n`)
    assert.strictEqual(validate(version, directory).length, 2)
    assert.strictEqual(
      releaseTag(version),
      version === '1.2.3+build-with-hyphens' ? 'latest' : 'next'
    )
  })
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
  assertTagNotNewer('1.2.3-dev.9', '1.2.3-dev.10')
  assertTagNotNewer('1.2.3-dev.feature.9', '1.2.3-dev.feature.10')
  assertTagNotNewer('1.2.3+build-b', '1.2.3+build-a')
  assertTagNotNewer('1.2.3-rc.9', '1.2.3')
  assertTagNotNewer('1.2.3', '1.2.4-alpha.0')
  assert.throws(() => assertTagNotNewer('1.3.0', '1.2.9'), /backwards/)
  assert.throws(() => assertTagNotNewer('1.2.3', '1.2.3-alpha.0'), /backwards/)
  assert.throws(() => assertTagNotNewer('1.2.3-beta.0', '1.2.3-alpha.10'), /backwards/)
  assert.throws(() => assertTagNotNewer('1.2.3-dev.10', '1.2.3-dev.9'), /backwards/)
  ;['invalid', 'v1.2.3', null].forEach((current) => {
    assert.throws(() => assertTagNotNewer(current, '1.2.3'), /Cannot compare/)
  })
})

test('fails closed on numeric prerelease identifiers beyond exact comparison', () => {
  assert.throws(
    () => assertTagNotNewer('1.2.3-dev.9007199254740993', '1.2.3-dev.9007199254740992'),
    /Cannot compare/
  )
  assert.throws(
    () => assertTagNotNewer('1.2.3-dev.9007199254740991', '1.2.3-dev.9007199254740990'),
    /backwards/
  )
})

test('runs with staged tinyexec and verkit without workspace dependencies', (t) => {
  const {directory} = fixture(t)
  const script = path.join(directory, 'scripts', 'release.js')
  fs.mkdirSync(path.dirname(script))
  fs.copyFileSync(path.join(__dirname, 'release.js'), script)
  const modules = path.join(directory, 'runtime', 'node_modules')
  ;['tinyexec', 'verkit'].forEach((name) => {
    fs.cpSync(path.dirname(require.resolve(`${name}/package.json`)), path.join(modules, name), {
      recursive: true
    })
  })
  xSync(
    process.execPath,
    [
      '-e',
      `const assert = require('assert')
      for (const name of ['tinyexec', 'verkit']) {
        assert.ok(require.resolve(name).startsWith(process.env.NODE_PATH))
      }
      const {validate, assertTagNotNewer} = require('./scripts/release')
      validate('1.2.3')
      assertTagNotNewer('1.2.3-dev.9', '1.2.3-dev.10')`
    ],
    {throwOnError: true, nodeOptions: {cwd: directory, env: {NODE_PATH: modules}}}
  )
})

test('scopes all publishing npm calls to external artifacts, preserving upload flags', (t) => {
  const {directory, write} = fixture(t)
  write('package.json', {
    devEngines: {packageManager: {name: 'pnpm', version: '12.18.0', onFail: 'download'}}
  })
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'jss-publish-artifacts-'))
  t.after(() => fs.rmSync(destination, {recursive: true, force: true}))
  const manifest = {
    version: '1.2.3',
    commit: 'fixture-commit',
    packages: ['a', 'b'].map((name) => {
      const filename = `${name}.tgz`
      fs.writeFileSync(path.join(destination, filename), `archive-${name}`)
      return {name, filename, integrity: integrity(path.join(destination, filename))}
    })
  }
  fs.writeFileSync(path.join(destination, 'manifest.json'), JSON.stringify(manifest))
  const remote = new Map([['a', manifest.packages[0].integrity]])
  const calls = []
  const mockExec = (command, args, options) => {
    if (command === 'git') {
      assert.strictEqual(options.nodeOptions.cwd, directory)
      assert.deepStrictEqual(Array.from(args), ['rev-parse', 'HEAD'])
      return {stdout: manifest.commit}
    }
    assert.strictEqual(command, 'npm')
    assert.strictEqual(options.nodeOptions.cwd, destination)
    assert.strictEqual(options.nodePath, false)
    calls.push(Array.from(args))
    if (args[0] === 'publish') {
      assert.deepStrictEqual(Array.from(args), [
        'publish',
        path.join(destination, 'b.tgz'),
        '--access',
        'public',
        '--tag',
        'latest',
        '--provenance',
        '--ignore-scripts',
        '--registry',
        'https://registry.npmjs.org/'
      ])
      assert.strictEqual(options.nodeOptions.stdio, 'inherit')
      remote.set('b', manifest.packages[1].integrity)
      return {stdout: ''}
    }
    assert.strictEqual(args[0], 'view')
    assert.deepStrictEqual(Array.from(args).slice(3), [
      '--json',
      '--registry',
      'https://registry.npmjs.org/'
    ])
    if (args[2] === 'dist-tags') return {stdout: '{"latest":"1.2.2"}'}
    assert.strictEqual(args[2], 'dist')
    const name = args[1].replace('@1.2.3', '')
    const value = remote.get(name)
    return {
      exitCode: value ? 0 : 1,
      stdout: JSON.stringify(value ? {integrity: value} : {error: {code: 'E404'}})
    }
  }
  // Execute the real CLI with only tinyexec mocked: no command can reach npm or GitHub.
  const scriptModule = {exports: {}}
  const load = (name) => (name === 'tinyexec' ? {xSync: mockExec} : require(name)) // eslint-disable-line import/no-dynamic-require, global-require
  load.main = scriptModule
  const processStub = {
    argv: ['node', 'release.js', 'publish', '1.2.3', destination],
    env: {GITHUB_ACTIONS: 'true', ACTIONS_ID_TOKEN_REQUEST_URL: 'https://oidc.invalid'}
  }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'release.js'), 'utf8'), {
    require: load,
    module: scriptModule,
    __dirname: path.join(directory, 'scripts'),
    process: processStub,
    console: {error: (message) => assert.fail(message)}
  })
  assert.strictEqual(processStub.exitCode, undefined)
  assert.strictEqual(calls.filter((args) => args[0] === 'publish').length, 1)
  assert.strictEqual(calls.filter((args) => args[2] === 'dist-tags').length, 2)
  assert.strictEqual(calls.filter((args) => args[2] === 'dist').length, 4)
})

test('refuses local publication without GitHub OIDC', () => {
  const result = xSync(process.execPath, [path.join(__dirname, 'release.js'), 'publish', '1.2.3'], {
    nodeOptions: {env: {GITHUB_ACTIONS: '', ACTIONS_ID_TOKEN_REQUEST_URL: ''}}
  })
  assert.strictEqual(result.exitCode, 1)
  assert.match(result.stderr, /only allowed in GitHub Actions/)
})
