// @flow

import React from 'react'
import isInBrowser from 'is-in-browser'
import {ThemeContext as DefaultThemeContext} from 'theming'

import JssContext from './JssContext'
import {
  createStaticSheet,
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
  const {index = getSheetIndex(), theming, name = 'Hook', ...sheetOptions} = options
  const ThemeContext = (theming && theming.context) || DefaultThemeContext
  const useTheme =
    typeof styles === 'function'
      ? // $FlowFixMe
        (): Theme => React.useContext(ThemeContext) || noTheme
      : // $FlowFixMe
        (): Theme => noTheme

  return (data: any) => {
    const isFirstMount = React.useRef(true)
    const context = React.useContext(JssContext)
    const theme = useTheme()

    const [staticSheet, setStaticSheet] = React.useState(() => {
      const sheet = createStaticSheet({
        context,
        styles,
        name,
        theme,
        index,
        sheetOptions
      })

      if (context.registry && sheet) {
        context.registry.add(sheet)
      }

      return sheet
    })

    const [dynamicRules, setDynamicRules] = React.useState(() => {
      if (staticSheet) {
        return addDynamicRules(staticSheet, data)
      }

      return undefined
    })

    const [classes, setClasses] = React.useState(() => {
      if (staticSheet) {
        return getSheetClasses(staticSheet, dynamicRules)
      }

      return {}
    })

    useEffectOrLayoutEffect(
      () => {
        if (staticSheet) {
          manageSheet({
            index,
            context,
            sheet: staticSheet,
            theme
          })
        }

        return () => {
          if (staticSheet) {
            unmanageSheet({
              index,
              context,
              sheet: staticSheet,
              theme
            })

            if (dynamicRules) {
              removeDynamicRules(staticSheet, dynamicRules)
            }
          }
        }
      },
      [staticSheet]
    )

    useEffectOrLayoutEffect(
      () => {
        if (dynamicRules && staticSheet) {
          updateDynamicRules(data, staticSheet, dynamicRules)
        }
      },
      [data]
    )

    useEffectOrLayoutEffect(
      () => {
        if (!isFirstMount.current) {
          const newStaticSheet = createStaticSheet({
            context,
            styles,
            name,
            theme,
            index,
            sheetOptions
          })
          const newDynamicRules = staticSheet ? addDynamicRules(staticSheet, data) : undefined
          const newClasses = staticSheet ? getSheetClasses(staticSheet, dynamicRules) : undefined

          setStaticSheet(newStaticSheet)
          setDynamicRules(newDynamicRules)
          setClasses(newClasses)
        }
      },
      [theme, context]
    )

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
