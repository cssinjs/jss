import * as React from 'react'
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
    ? React.useEffect
    : React.useInsertionEffect || // React 18+ (https://github.com/reactwg/react-18/discussions/110)
        React.useLayoutEffect
}

const noTheme = {}

const createUseStyles = (styles, options = {}) => {
  const {index = getSheetIndex(), theming, name, ...sheetOptions} = options
  const ThemeContext = (theming && theming.context) || DefaultThemeContext

  const useTheme = (theme) => {
    if (typeof styles === 'function') {
      return theme || React.useContext(ThemeContext) || noTheme
    }

    return noTheme
  }

  const emptyObject = {}

  return function useStyles(data) {
    const isFirstMount = React.useRef(true)
    const context = React.useContext(JssContext)
    const theme = useTheme(data && data.theme)

    const [sheet, dynamicRules] = React.useMemo(() => {
      const newSheet = createStyleSheet({
        context,
        styles,
        name,
        theme,
        index,
        sheetOptions
      })

      if (newSheet) {
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

    getUseInsertionEffect(context.isSSR)(
      () => () => {
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
      },
      [sheet]
    )

    const classes = React.useMemo(
      () => (sheet && dynamicRules ? getSheetClasses(sheet, dynamicRules) : emptyObject),
      [sheet, dynamicRules]
    )

    React.useDebugValue(classes)

    React.useDebugValue(theme === noTheme ? 'No theme' : theme)

    React.useEffect(() => {
      isFirstMount.current = false
    })

    return classes
  }
}

export default createUseStyles
