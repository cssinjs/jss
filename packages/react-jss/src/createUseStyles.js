// @flow

import React from 'react'
import isInBrowser from 'is-in-browser'
import {ThemeContext as DefaultThemeContext} from 'theming'

import JssContext from './JssContext'
import {
  createStyleSheet,
  addDynamicRules,
  updateDynamicRules,
  removeDynamicRules
} from './utils/sheets'
import getSheetIndex from './utils/getSheetIndex'
import type {HookOptions, Styles} from './types'
import {manageSheet, unmanageSheet} from './utils/managers'
import getSheetClasses from './utils/getSheetClasses'

const useEffectOrLayoutEffect = isInBrowser ? React.useLayoutEffect : React.useEffect

const noTheme = {}

const createUseStyles = <Theme: {}>(styles: Styles<Theme>, options?: HookOptions<Theme> = {}) => {
  const {index = getSheetIndex(), theming, name, ...sheetOptions} = options
  const ThemeContext = (theming && theming.context) || DefaultThemeContext
  const useTheme =
    typeof styles === 'function'
      ? // $FlowFixMe
        (): Theme => React.useContext(ThemeContext) || noTheme
      : // $FlowFixMe
        (): Theme => noTheme

  return function useStyles(data: any) {
    const isFirstMount = React.useRef(true)
    const context = React.useContext(JssContext)
    const theme = useTheme()

    const [sheet, dynamicRules] = React.useMemo(
      () => {
        const newSheet = createStyleSheet({
          context,
          styles,
          name,
          theme,
          index,
          sheetOptions
        })

        const newDynamicRules = newSheet ? addDynamicRules(newSheet, data) : null

        if (newSheet) {
          manageSheet({
            index,
            context,
            sheet: newSheet,
            theme
          })
        }

        return [newSheet, newDynamicRules]
      },
      [context, theme]
    )

    useEffectOrLayoutEffect(
      () => {
        // We only need to update the rules on a subsequent update and not in the first mount
        if (sheet && dynamicRules && !isFirstMount.current) {
          updateDynamicRules(data, sheet, dynamicRules)
        }
      },
      [data]
    )

    useEffectOrLayoutEffect(
      () =>
        // cleanup only
        () => {
          if (sheet) {
            unmanageSheet({
              index,
              context,
              sheet,
              theme
            })
          }

          if (sheet && dynamicRules) {
            removeDynamicRules(sheet, dynamicRules)
          }
        },
      [sheet]
    )

    const classes = sheet && dynamicRules ? getSheetClasses(sheet, dynamicRules) : {}

    // $FlowFixMe
    React.useDebugValue(classes)
    // $FlowFixMe
    React.useDebugValue(theme === noTheme ? 'No theme' : theme)

    React.useEffect(() => {
      isFirstMount.current = false
    })

    return classes
  }
}

export default createUseStyles
