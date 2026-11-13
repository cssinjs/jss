import path from 'path'
import {transformAsync} from '@babel/core'
import camelCase from 'camelcase'
import babelOptions from './babelOptions.js'
import getPackageJson from './scripts/get-package-json.js'

const {getBabelOptions} = babelOptions
const pkg = getPackageJson()
const input = path.resolve('src/index.js')
const name = camelCase(pkg.name)
const globals = {jss: 'jss', 'react-jss': 'reactJss', react: 'React'}

Object.keys(pkg.peerDependencies || {}).forEach((key) => {
  if (!(key in globals)) {
    throw new Error(`Missing peer dependency "${key}" in the globals map.`)
  }
})

const external = (id) => !id.startsWith('.') && !path.isAbsolute(id)
// Transform Flow/JSX before Rolldown parses it, retaining the existing Babel
// targets, loose transforms, dev-expression behavior and runtime helper imports.
const babel = ({useESModules}) => ({
  name: 'babel',
  async transform(code, id) {
    if (!path.isAbsolute(id) || id.includes('/node_modules/') || !id.endsWith('.js')) {
      return null
    }
    const result = await transformAsync(code, {
      filename: id,
      babelrc: false,
      configFile: false,
      sourceMaps: true,
      caller: {name: 'rolldown', supportsStaticESM: true},
      ...getBabelOptions({useESModules})
    })
    return {code: result.code, map: result.map}
  },
  // Rolldown's runtime can contain ES2015 even with generatedCode: es5.
  async renderChunk(code, chunk, output) {
    if (output.minify) return null
    const result = await transformAsync(code, {
      filename: chunk.fileName,
      babelrc: false,
      configFile: false,
      sourceMaps: Boolean(output.sourcemap),
      presets: [['@babel/env', {loose: true, modules: false}]]
    })
    return {code: result.code, map: result.map}
  },
  // Native minification runs after renderChunk and may introduce modern syntax.
  // Lower its final output too, without changing the established ES5 UMD contract.
  async generateBundle(output, bundle) {
    if (!output.minify) return
    for (const chunk of Object.values(bundle)) {
      if (chunk.type === 'chunk') {
        const result = await transformAsync(chunk.code, {
          filename: chunk.fileName,
          babelrc: false,
          configFile: false,
          shouldPrintComment: (comment) => /@license|@preserve|^!/.test(comment),
          compact: true,
          minified: true,
          presets: [['@babel/env', {loose: true, modules: false}]]
        })
        chunk.code = result.code
      }
    }
  }
})

const flowEntry = {
  name: 'flow-entry',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: `${path.basename(pkg.main)}.flow`,
      source: "// @flow\n\nexport * from '../src';"
    })
  }
}

function config({file, format, bundled = false, production = false, useESModules = true}) {
  return {
    input,
    // Neutral avoids implicitly replacing NODE_ENV in the externalized builds.
    platform: bundled ? 'browser' : 'neutral',
    // Keep generated bundler/minifier syntax compatible with legacy consumers.
    transform: {
      target: 'es2015',
      define: {
        'process.env.VERSION': JSON.stringify(pkg.version),
        ...(bundled && {
          'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
        })
      }
    },
    external: bundled ? (format === 'umd' ? Object.keys(globals) : []) : external,
    output: {
      file,
      format,
      generatedCode: {preset: 'es5'},
      ...(format === 'umd' && {
        name,
        globals,
        exports: 'named',
        sourcemap: !production,
        minify: production
      }),
      ...(format === 'cjs' && {exports: 'named'})
    },
    plugins: [...(format === 'cjs' ? [flowEntry] : []), babel({useESModules})]
  }
}

export default [
  config({file: `dist/${pkg.name}.js`, format: 'umd', bundled: true}),
  config({file: `dist/${pkg.name}.min.js`, format: 'umd', bundled: true, production: true}),
  config({file: pkg.main, format: 'cjs', useESModules: false}),
  config({file: pkg.module, format: 'esm'}),
  config({file: pkg.unpkg, format: 'esm', bundled: true})
]
