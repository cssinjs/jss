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
import {getIndex} from './utils/indexCounter'
import type {HookOptions, Styles} from './types'
import {manageSheet, unmanageSheet} from './utils/managers'
import {getSheetClasses} from './utils/getSheetClasses'

const noTheme = {}

const createUseStyles = <Theme: {}>(styles: Styles<Theme>, options?: HookOptions<Theme> = {}) => {
  const {index = getIndex(), theming, name = 'Hook', ...sheetOptions} = options
  const isFirstMount = React.useRef(true)
  const ThemeContext = (theming && theming.context) || DefaultThemeContext
  const useTheme =
    typeof styles === 'function'
      ? // $FlowFixMe
        (): Theme => React.useContext(ThemeContext)
      : // $FlowFixMe
        (): Theme => noTheme

  const useLayoutEffect = isInBrowser ? React.useLayoutEffect : React.useEffect

  return (data: any) => {
    const context = React.useContext(JssContext)
    const theme = useTheme()

    if (context.disableStylesGeneration) {
      return {}
    }

    const [staticSheet, setStaticSheet] = React.useState(() => {
      const sheet = createStaticSheet({
        context,
        styles,
        name,
        theme,
        index,
        sheetOptions
      })

      if (context.registry) {
        context.registry.add(sheet)
      }

      return sheet
    })

    const [dynamicRules, setDynamicRules] = React.useState(() => addDynamicRules(staticSheet, data))

    const [classes, setClasses] = React.useState(() => getSheetClasses(staticSheet, dynamicRules))

    useLayoutEffect(
      () => {
        manageSheet({
          index,
          context,
          sheet: staticSheet,
          theme
        })

        return () => {
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
      },
      [staticSheet]
    )

    useLayoutEffect(
      () => {
        if (dynamicRules) {
          updateDynamicRules(data, staticSheet, dynamicRules)
        }
      },
      [data]
    )

    useLayoutEffect(
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
          const newDynamicRules = addDynamicRules(staticSheet, data)
          const newClasses = getSheetClasses(staticSheet, dynamicRules)

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
