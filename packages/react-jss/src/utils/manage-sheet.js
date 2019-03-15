// @flow

import type {StyleSheet} from 'jss'
import type {Context} from '../types'
import {getManager} from './managers'

interface Options<Theme> {
  sheet: ?StyleSheet;
  context: Context;
  index: number;
  theme: Theme;
}

const manageSheet = <Theme>(options: Options<Theme>) => {
  const {sheet} = options
  if (!sheet) {
    return
  }

  const manager = getManager(options.context, options.index)

  manager.manage(options.theme)

  if (options.context.registry) {
    options.context.registry.add(sheet)
  }
}

export {manageSheet}
