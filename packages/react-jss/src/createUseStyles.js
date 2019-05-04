// @flow

import React from 'react'
import isInBrowser from 'is-in-browser'
import {ThemeContext as DefaultThemeContext} from 'theming'

import JssContext from './JssContext'
import {createStaticSheet, addDynamicRules, updateDynamicRules} from './utils/sheets'
import {getIndex} from './utils/indexCounter'
import type {HookOptions, Styles} from './types'
import {manageSheet} from './utils/managers'
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
      },
      [staticSheet]
    )

    useLayoutEffect(
      () => {
        updateDynamicRules(data, staticSheet, dynamicRules)
      },
      [data]
    )

    React.useDebugValue(classes)
    React.useDebugValue(theme === noTheme ? 'No theme' : theme)

    return classes
  }
}

export default createUseStyles
