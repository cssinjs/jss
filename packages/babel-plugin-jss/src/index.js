import {declare} from '@babel/helper-plugin-utils'
import {create as createJss} from 'jss'
import preset from 'jss-preset-default'
import serializeNode from './utils/serializeNode'
import insertRawRule from './utils/insertRawRule'
import removeNonFunctionProps from './utils/removeNonFunctionProps'
import removeEmptyObjects from './utils/removeEmptyObjects'
import buildClassesNode from './utils/buildClassesNode'
import extendOptions from './utils/extendOptions'
import findStylesNode from './utils/findStylesNode'
import isSupportedCallIdentifier from './utils/isSupportedCallIdentifier'

export default declare(api => {
  // We should be using `api.assertVersion()` but it seems not supporting
  // this scenario. Revisit it later.
  if (api.version[0] !== '6' && api.version[0] !== '7') {
    throw new Error(
      `Requires Babel ">= 6 <= 7", but was loaded with "${api.version}". ` +
        `If you are sure you have a compatible version of @babel/core, ` +
        `it is likely that something in your build process is loading the ` +
        `wrong version. Inspect the stack trace of this error to look for ` +
        `the first entry that doesn't mention "@babel/core" or "babel-core" ` +
        `to see what is calling Babel.`
    )
  }

  let jss

  return {
    visitor: {
      CallExpression(callPath, {opts}) {
        if (!isSupportedCallIdentifier(callPath, opts.identifiers)) return

        // Babel 6 doesn't pass opts as an argument to `declare()`
        if (!jss) jss = createJss(opts.jssOptions || preset())

        const stylesNode = findStylesNode(callPath)
        const styles = serializeNode(callPath, stylesNode, opts.theme || {})
        const sheet = jss.createStyleSheet(styles)

        if (!sheet.toString()) return

        insertRawRule(callPath, stylesNode, sheet)
        removeNonFunctionProps(callPath, stylesNode)
        removeEmptyObjects(stylesNode)
        extendOptions(callPath, buildClassesNode(sheet))
      }
    }
  }
})
