// @flow

import type {StyleSheet} from 'jss'
import type {Context} from '../types'
import {getManager} from './managers'

interface Options {
  sheet: ?StyleSheet;
  context: Context;
  index: number;
  theme: {};
}

const unmanageSheet = (options: Options) => {
  if (!options.sheet) {
    return
  }

  const manager = getManager(options.context, options.index)

  manager.unmanage(options.theme)
}

export {unmanageSheet}
