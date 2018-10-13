import {Plugin, JssOptions} from 'jss'
import {Options} from 'jss-plugin-syntax-default-unit'

type Options = {defaultUnit?: Options}

export default function jssPresetDefault(options?: Options): JssOptions
