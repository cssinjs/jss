// @flow

import React from 'react'
import {ThemeContext as DefaultThemeContext} from 'theming'

import JssContext from '../JssContext';
import {createSheet} from '../utils/create-sheet'
import {getIndex} from '../utils/index-counter'
import type {HookOptions, Styles} from '../types'

const noTheme = {};

function createUseStyles<Theme: {}>(styles: Styles<Theme>, options?: HookOptions<Theme> = {}) {
  const {index = getIndex(), theming, name = '', ...sheetOptions} = options;
  const ThemeContext = (theming && theming.context) || DefaultThemeContext

  return (data) => {
    const jssContext = React.useContext(JssContext);
    const theme = typeof styles === 'function' ? React.useContext(ThemeContext) : noTheme;

    const sheet = React.useMemo(() => {
      if (jssContext.disableStylesGeneration) {
        return undefined;
      }

      return createSheet({
        jssContext,
        styles,
        name,
        theme,
        index,
      });
    }, [theme, jssContext]);

    return React.useMemo(() => {

    }, [sheet]);
  };
}