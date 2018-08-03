// @flow
import functions from 'jss-plugin-syntax-rule-value-function'
import observable from 'jss-plugin-syntax-rule-value-observable'
import template from 'jss-plugin-syntax-template'
import global from 'jss-plugin-syntax-global'
import extend from 'jss-plugin-syntax-extend'
import nested from 'jss-plugin-syntax-nested'
import compose from 'jss-plugin-syntax-compose'
import camelCase from 'jss-plugin-syntax-camel-case'
import defaultUnit, {type Options as DefaultUnitOptions} from 'jss-plugin-syntax-default-unit'
import expand from 'jss-plugin-syntax-expand'
import vendorPrefixer from 'jss-plugin-vendor-prefixer'
import propsSort from 'jss-plugin-props-sort'

type Options = {defaultUnit?: DefaultUnitOptions}

export default (options: Options = {}) => ({
  plugins: [
    functions(),
    observable(),
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
