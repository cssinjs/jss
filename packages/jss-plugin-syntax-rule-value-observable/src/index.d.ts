import {Plugin} from 'jss'

export type Options = {
  process?: boolean
  force?: boolean
}

export default function jssPluginSyntaxRuleValueObservable(options?: Options): Plugin
