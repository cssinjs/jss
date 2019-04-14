// @flow

import React from 'react'
import {ThemeContext as DefaultThemeContext} from 'theming'

import {JssContext} from './JssContext'
import {createStaticSheet, addDynamicRules, removeDynamicRules, updateDynamicRules} from './utils/sheets'
import {getIndex} from './utils/index-counter'
import type {HookOptions, Styles} from './types'
import {unmanageSheet, manageSheet} from './utils/managers'
import {getSheetClasses} from './utils/get-sheet-classes'

const noTheme = {}

function createUseStyles<Theme: {}>(styles: Styles<Theme>, options?: HookOptions<Theme> = {}) {
  const {index = getIndex(), theming, name = 'Hook', ...sheetOptions} = options
  const ThemeContext = (theming && theming.context) || DefaultThemeContext

  return (data: any) => {
    const jssContext = React.useContext(JssContext)
    const theme = typeof styles === 'function' ? React.useContext(ThemeContext) : noTheme

    // When the theme or the context changes we create a new sheet
    const sheet = React.useMemo(
      () => {
        if (jssContext.disableStylesGeneration) {
          return undefined
        }

        const stylesheet = createStaticSheet({
          context: jssContext,
          styles,
          name,
          theme,
          index,
          sheetOptions
        })

        manageSheet({
          index,
          context: jssContext,
          sheet: stylesheet,
          theme
        })

        return sheet
      },
      [theme, jssContext]
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
          context: jssContext,
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

export {createUseStyles}
