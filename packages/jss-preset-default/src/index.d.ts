import {Plugin, JssOptions} from 'jss'
import {Options as DefaultUnitOptions} from 'jss-plugin-default-unit'
import {Options as ObservableOptions} from 'jss-plugin-rule-value-observable'
import {ComposeProperties} from 'jss-plugin-compose'
import {extendProperties} from 'jss-plugin-extend'

type Options = {defaultUnit?: DefaultUnitOptions; observable?: ObservableOptions}

export type AdditionalProperties = ComposeProperties & extendProperties

export default function jssPresetDefault(options?: Options): JssOptions
