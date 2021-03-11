import {JssStyle, Plugin} from 'jss'

export type ExtendProperties = {
  extends: (JssStyle | string)[] | JssStyle | string
}

export default function jssPluginSyntaxExtend(): Plugin
