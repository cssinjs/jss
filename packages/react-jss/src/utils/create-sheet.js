// @flow
import warning from 'tiny-warning'
import {getDynamicStyles} from 'jss'
import type {Context, Styles} from '../types'
import {getManager} from './managers'
import defaultJss from '../jss'

interface Options<Theme: {}> {
  jssContext: Context,
  theme: Theme,
  name: string,
  index: number,
  styles: Styles<Theme>,
}

const getStyles = <Theme: {}>(options: Options<Theme>) => {
  const {styles} = options;
  if (typeof styles !== 'function') {
    return styles
  }

  warning(
    styles.length !== 0,
    `[JSS] <${options.name} />'s styles function doesn't rely on the "theme" argument. We recommend declaring styles as an object instead.`
  )

  return styles(options.theme)
}

function getSheetOptions<Theme: {}>(options: Options<Theme>, link: boolean) {
  return {
    // TODO
    // ...sheetOptions,
    ...options.jssContext.sheetOptions,
    index: options.index,
    meta: `${options.name}, ${typeof options.styles === 'function' ? 'Themed' : 'Unthemed'}`,
    classNamePrefix: options.jssContext.sheetOptions.classNamePrefix + process.env.NODE_ENV === 'production' ? '' : `${options.name.replace(/\s/g, '-')}-`,
    link,
  };
}


function createSheet<Theme: {}>(options: Options<Theme>) {
  const manager = getManager(options.jssContext, options.index);
  const existingSheet = manager.get(options.theme)

  if (existingSheet) {
    return existingSheet
  }

  const jss = options.jssContext.jss || defaultJss
  const styles = getStyles(options)
  const dynamicStyles = getDynamicStyles(styles)
  const sheet = jss.createStyleSheet(styles, getSheetOptions(options, dynamicStyles !== null))

  sheet.dynamicStyles = dynamicStyles
  sheet.styles = styles
  sheet.dynamicRuleCounter = 0

  manager.add(options.theme, sheet)

  return sheet;
}

export {createSheet}