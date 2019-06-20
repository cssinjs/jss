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

const reducer = (prevState, action) => {
  if (action.type === 'updateSheet') {
    return action.payload
  }
  return prevState
}

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

    const [state, dispatch] = React.useReducer(reducer, null, () => {
      const sheet = createStyleSheet({
        context,
        styles,
        name,
        theme,
        index,
        sheetOptions
      })

      let dynamicRules
      let classes
      if (sheet) {
        if (context.registry) {
          context.registry.add(sheet)
        }
        dynamicRules = addDynamicRules(sheet, data)
        classes = getSheetClasses(sheet, dynamicRules)
      }

      return {
        sheet,
        dynamicRules,
        classes: classes || {}
      }
    })

    useEffectOrLayoutEffect(
      () => {
        if (state.sheet) {
          manageSheet({
            index,
            context,
            sheet: state.sheet,
            theme
          })
        }

        return () => {
          const {sheet, dynamicRules} = state

          if (!sheet) return

          unmanageSheet({
            index,
            context,
            sheet,
            theme
          })

          if (dynamicRules) {
            removeDynamicRules(sheet, dynamicRules)
          }
        }
      },
      [state.sheet]
    )

    useEffectOrLayoutEffect(
      () => {
        // We only need to update the rules on a subsequent update and not in the first mount
        if (state.sheet && state.dynamicRules && !isFirstMount.current) {
          updateDynamicRules(data, state.sheet, state.dynamicRules)
        }
      },
      [data]
    )

    useEffectOrLayoutEffect(
      () => {
        if (!isFirstMount.current) {
          const newSheet = createStyleSheet({
            context,
            styles,
            name,
            theme,
            index,
            sheetOptions
          })
          const newDynamicRules = newSheet && addDynamicRules(newSheet, data)
          const newClasses = newSheet ? getSheetClasses(newSheet, newDynamicRules) : {}

          dispatch({
            type: 'updateSheet',
            payload: {
              sheet: newSheet,
              dynamicRules: newDynamicRules,
              classes: newClasses
            }
          })
        }
      },
      [theme, context]
    )

    // $FlowFixMe
    React.useDebugValue(state.classes)
    // $FlowFixMe
    React.useDebugValue(theme === noTheme ? 'No theme' : theme)

    React.useEffect(() => {
      isFirstMount.current = false
    })

    return state.classes
  }
}

export default createUseStyles
