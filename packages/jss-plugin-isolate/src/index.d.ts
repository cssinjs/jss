import {Plugin} from 'jss'

type Options = {
  isolate?: boolean | string
  reset?: 'all' | 'inherited' | object | ['all' | 'inherited', object]
}

export default function jssPluginIsolate(options?: Options): Plugin
