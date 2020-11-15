// @flow
import functions from 'jss-plugin-rule-value-function'
import observable, {type Options as ObservableOptions} from 'jss-plugin-rule-value-observable'
import template from 'jss-plugin-template'
import global from 'jss-plugin-global'
import extend from 'jss-plugin-extend'
import nested from 'jss-plugin-nested'
import compose from 'jss-plugin-compose'
import camelCase from 'jss-plugin-camel-case'
import defaultUnit, {type Options as DefaultUnitOptions} from 'jss-plugin-default-unit'
import expand from 'jss-plugin-expand'
import vendorPrefixer from 'jss-plugin-vendor-prefixer'
import propsSort from 'jss-plugin-props-sort'
import type {JssOptions} from 'jss'

type Create = (
  {|
    defaultUnit?: DefaultUnitOptions,
    observable?: ObservableOptions
  |} | void
) => JssOptions

const create: Create = (options = {}) => ({
  plugins: [
    functions(),
    observable(options.observable),
    template(),
    global(),
    extend(),
    nested(),
    compose(),
    camelCase(),
    defaultUnit(options.defaultUnit),
    expand(),
    vendorPrefixer(),
    propsSort()
  ]
})

export default create
