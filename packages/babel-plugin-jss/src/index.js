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

export default declare((api, {identifiers, jssOptions = preset(), theme = {}}) => {
  api.assertVersion(7)

  const jss = createJss(jssOptions)

  return {
    visitor: {
      CallExpression(callPath) {
        if (!isSupportedCallIdentifier(callPath, identifiers)) return
        const stylesNode = findStylesNode(callPath)
        const styles = serializeNode(callPath, stylesNode, theme)
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
