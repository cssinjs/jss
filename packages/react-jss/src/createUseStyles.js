import * as React from 'react'
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
import {manageSheet, unmanageSheet} from './utils/managers'
import getSheetClasses from './utils/getSheetClasses'

const useEffectOrLayoutEffect = isInBrowser ? React.useLayoutEffect : React.useEffect

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

    const sheet = React.useMemo(
      () =>
        createStyleSheet({
          context,
          styles,
          name,
          theme,
          index,
          sheetOptions
        }),
      [context, theme]
    )

    const [dynamicRules, setDynamicRules] = React.useState(() =>
      sheet ? addDynamicRules(sheet, data) : null
    )

    useEffectOrLayoutEffect(() => {
      if (isFirstMount.current) {
        return // set on mount by useState
      }

      const newDynamicRules = sheet ? addDynamicRules(sheet, data) : null
      setDynamicRules(newDynamicRules)

      // eslint-disable-next-line consistent-return
      return () => {
        if (sheet && newDynamicRules) {
          removeDynamicRules(sheet, newDynamicRules)
        }
      }
    }, [sheet])

    useEffectOrLayoutEffect(() => {
      manageSheet({
        index,
        context,
        sheet,
        theme
      })

      return () => {
        if (sheet) {
          unmanageSheet({
            index,
            context,
            sheet,
            theme
          })
        }
      }
    }, [sheet])

    useEffectOrLayoutEffect(() => {
      // We only need to update the rules on a subsequent update and not in the first mount
      if (sheet && dynamicRules && !isFirstMount.current) {
        updateDynamicRules(data, sheet, dynamicRules)
      }
    }, [data])

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
