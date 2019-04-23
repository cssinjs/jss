// @flow

import React from 'react'
import {ThemeContext as DefaultThemeContext} from 'theming'

import JssContext from './JssContext'
import {
  createStaticSheet,
  addDynamicRules,
  removeDynamicRules,
  updateDynamicRules
} from './utils/sheets'
import {getIndex} from './utils/indexCounter'
import type {HookOptions, Styles} from './types'
import {unmanageSheet, manageSheet} from './utils/managers'
import {getSheetClasses} from './utils/getSheetClasses'

const noTheme = {}

const createUseStyles = <Theme: {}>(styles: Styles<Theme>, options?: HookOptions<Theme> = {}) => {
  const {index = getIndex(), theming, name = 'Hook', ...sheetOptions} = options
  const ThemeContext = (theming && theming.context) || DefaultThemeContext
  const useTheme =
    typeof styles === 'function'
      ? // $FlowFixMe
        (): Theme => React.useContext(ThemeContext)
      : // $FlowFixMe
        (): Theme => noTheme

  return (data: any) => {
    const context = React.useContext(JssContext)
    const theme = useTheme()

    // When the theme or the context changes we create a new sheet
    const sheet = React.useMemo(
      () => {
        if (context.disableStylesGeneration) {
          return undefined
        }

        const staticSheet = createStaticSheet({
          context,
          styles,
          name,
          theme,
          index,
          sheetOptions
        })

        manageSheet({
          index,
          context,
          sheet: staticSheet,
          theme
        })

        return staticSheet
      },
      [theme, context]
    )

    // When the sheet changes, we readd the dynamic rules and update them
    const dynamicRules = React.useMemo(
      () => {
        const rules = addDynamicRules(sheet)

        updateDynamicRules(data, sheet, rules)

        return rules
      },
      [sheet]
    )

    // Update the dynamic rules before the actual render if the data has changed
    React.useLayoutEffect(
      () => {
        updateDynamicRules(data, sheet, dynamicRules)
      },
      [data]
    )

    // Remove the old sheet when the sheet has changed after the render
    React.useEffect(
      () => () => {
        removeDynamicRules(sheet, dynamicRules)

        unmanageSheet({
          context,
          index,
          theme,
          sheet
        })
      },
      [sheet]
    )

    // Only compute the sheet classes when there is a sheet, otherwise return an empty object
    // Because there are no deep properties, accessing any style will result in undefined
    return React.useMemo(() => (sheet ? getSheetClasses(sheet, dynamicRules) : {}), [
      sheet,
      dynamicRules
    ])
  }
}

export default createUseStyles
