// Run after yarn build: these checks exercise published artifacts, not source aliases.
const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const {createRequire} = require('module')
const {test} = require('node:test') // eslint-disable-line import/no-unresolved
const camelCase = require('camelcase')
const {parse} = require('acorn')
const jss = require('jss')
const reactJss = require('react-jss')
const React = require('react')
const jssPackage = require('../packages/jss/package.json')

const root = path.resolve(__dirname, '..')
const globals = {jss, reactJss, React}
const exportNames = (value) =>
  Object.keys(value)
    .filter((key) => key !== '__esModule')
    .sort()

fs.readdirSync(path.join(root, 'packages')).forEach((directory) => {
  const location = path.join(root, 'packages', directory)
  const pkg = JSON.parse(fs.readFileSync(path.join(location, 'package.json'), 'utf8'))
  const read = (file) => fs.readFileSync(path.join(location, file), 'utf8')

  test(`${pkg.name}: published entry points and browser bundles`, async () => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const cjs = require(path.join(location, pkg.main))
    const names = exportNames(cjs)
    const esm = read(pkg.module)
    parse(read(pkg.main), {ecmaVersion: 5})
    parse(esm, {ecmaVersion: 2015, sourceType: 'module'})
    assert(!esm.includes('process.env.VERSION'))
    assert(!read(pkg.main).includes('process.env.VERSION'))
    assert.strictEqual(read(`${pkg.main}.flow`), "// @flow\n\nexport * from '../src';")

    // Execute externalized ESM against installed dependencies, not source aliases.
    const entry = new vm.SourceTextModule(esm)
    const modules = new Map()
    const requireFromPackage = createRequire(path.join(location, 'package.json'))
    await entry.link((specifier) => {
      if (!modules.has(specifier)) {
        const value = requireFromPackage(specifier)
        const keys = Object.keys(value)
        if (!keys.includes('default')) keys.push('default')
        modules.set(
          specifier,
          new vm.SyntheticModule(keys, function initialize() {
            keys.forEach((key) => {
              this.setExport(key, key === 'default' ? value.default || value : value[key])
            })
          })
        )
      }
      return modules.get(specifier)
    })
    await entry.evaluate()
    assert.deepStrictEqual(exportNames(entry.namespace), names)

    for (const suffix of ['.js', '.min.js']) {
      const file = `dist/${pkg.name}${suffix}`
      const code = read(file)
      parse(code, {ecmaVersion: 5})
      assert(!code.includes('process.env.NODE_ENV'), file)
      assert(!code.includes('process.env.VERSION'), file)

      // Browser globals: deliberately no process, require or module available.
      const context = {...globals, console}
      vm.runInNewContext(code, context, {filename: file})
      assert.deepStrictEqual(exportNames(context[camelCase(pkg.name)]), names)

      // Also exercise the CommonJS branch of the UMD wrapper.
      const module = {exports: {}}
      vm.runInNewContext(code, {
        module,
        exports: module.exports,
        require: requireFromPackage,
        console
      })
      assert.deepStrictEqual(exportNames(module.exports), names)

      let amdExports
      const define = (dependencies, factory) => {
        amdExports = {}
        factory(
          ...dependencies.map((id) => (id === 'exports' ? amdExports : requireFromPackage(id)))
        )
      }
      define.amd = true
      vm.runInNewContext(code, {define, console})
      assert.deepStrictEqual(exportNames(amdExports), names)
    }

    const map = JSON.parse(read(`dist/${pkg.name}.js.map`))
    assert(map.sources.some((source) => source.endsWith('/src/index.js')))
    assert(map.sourcesContent.some((source) => source && source.includes('export')))

    const standalone = read(pkg.unpkg)
    parse(standalone, {ecmaVersion: 2015, sourceType: 'module'})
    assert(!standalone.includes('process.env.NODE_ENV'))
    assert(!standalone.includes('process.env.VERSION'))
    const bundle = new vm.SourceTextModule(standalone)
    await bundle.link((specifier) => {
      throw new Error(`Unexpected standalone dependency: ${specifier}`)
    })
    await bundle.evaluate()
    assert.deepStrictEqual(exportNames(bundle.namespace), names)
  })
})

test('react-jss: bundled dependency license notices survive minification', () => {
  const code = fs.readFileSync(path.join(root, 'packages/react-jss/dist/react-jss.min.js'), 'utf8')
  assert(code.includes('@license'))
})

test('jss: runtime environment checks and embedded version', () => {
  const pkg = jssPackage
  const read = (file) => fs.readFileSync(path.join(root, 'packages/jss', file), 'utf8')
  assert(read(pkg.main).includes('process.env.NODE_ENV'))
  assert(read(pkg.module).includes('process.env.NODE_ENV'))
  assert.strictEqual(jss.default.version, pkg.version)
  const warning = '[JSS] Rule is not linked. Missing sheet option'
  assert(read('dist/jss.js').includes(warning))
  assert(!read('dist/jss.min.js').includes(warning))
})
