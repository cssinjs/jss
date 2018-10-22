import {Plugin, JssOptions} from 'jss'
import {Options as DefaultUnitOptions} from 'jss-plugin-syntax-default-unit'
import {Options as ObservableOptions} from 'jss-plugin-syntax-rule-value-observable'

type Options = {defaultUnit?: DefaultUnitOptions; observable?: ObservableOptions}

export default function jssPresetDefault(options?: Options): JssOptions
