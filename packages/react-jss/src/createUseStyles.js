import React, {useEffect, useLayoutEffect, useContext, useRef, useMemo, useDebugValue} from 'react'
import {ThemeContext as DefaultThemeContext} from 'theming'

import JssContext from './JssContext'
import {
  createStyleSheet,
  addDynamicRules,
  updateDynamicRules,
  removeDynamicRules
} from './utils/sheets'
import getSheetIndex from './utils/getSheetIndex'
import {manageSheet, unmanageSheet} from './utils/managers'
import getSheetClasses from './utils/getSheetClasses'

function getUseInsertionEffect(isSSR) {
  return isSSR
    ? useEffect
    : React.useInsertionEffect || // React 18+ (https://github.com/reactwg/react-18/discussions/110)
        useLayoutEffect
}

const noTheme = {}

const createUseStyles = (styles, options = {}) => {
  const {index = getSheetIndex(), theming, name, ...sheetOptions} = options
  const ThemeContext = (theming && theming.context) || DefaultThemeContext

  const useTheme = (theme) => {
    if (typeof styles === 'function') {
      return theme || useContext(ThemeContext) || noTheme
    }

    return noTheme
  }

  const emptyObject = {}

  return function useStyles(data) {
    const isFirstMount = useRef(true)
    const context = useContext(JssContext)
    const theme = useTheme(data && data.theme)

    const [sheet, dynamicRules] = useMemo(() => {
      const newSheet = createStyleSheet({
        context,
        styles,
        name,
        theme,
        index,
        sheetOptions
      })

      if (newSheet && context.isSSR) {
        // manage immediately during SSRs. browsers will manage the sheet through useInsertionEffect below
        manageSheet({
          index,
          context,
          sheet: newSheet,
          theme
        })
      }

      return [newSheet, newSheet ? addDynamicRules(newSheet, data) : null]
    }, [context, theme])

    getUseInsertionEffect(context.isSSR)(() => {
      // We only need to update the rules on a subsequent update and not in the first mount
      if (sheet && dynamicRules && !isFirstMount.current) {
        updateDynamicRules(data, sheet, dynamicRules)
      }
    }, [data])

    getUseInsertionEffect(context.isSSR)(() => {
      if (sheet) {
        manageSheet({
          index,
          context,
          sheet,
          theme
        })
      }

      return () => {
        if (sheet) {
          unmanageSheet({
            index,
            context,
            sheet,
            theme
          })

          // when sheet changes, remove related dynamic rules
          if (dynamicRules) {
            removeDynamicRules(sheet, dynamicRules)
          }
        }
      }
    }, [sheet])

    const classes = useMemo(
      () => (sheet && dynamicRules ? getSheetClasses(sheet, dynamicRules) : emptyObject),
      [sheet, dynamicRules]
    )

    useDebugValue(classes)

    useDebugValue(theme === noTheme ? 'No theme' : theme)

    useEffect(() => {
      isFirstMount.current = false
    })

    return classes
  }
}

export default createUseStyles
