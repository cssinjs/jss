import {Plugin} from 'jss'

export type ComposeProperties = {
  composes: (string | string[])[]
}

export default function jssPluginSyntaxCompose(): Plugin
