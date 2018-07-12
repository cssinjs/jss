// @flow

import template from 'jss-template'
// import global from 'jss-global'
import extend from 'jss-extend'
import nested from 'jss-nested'
import compose from 'jss-compose'
import camelCase from 'jss-camel-case'
import defaultUnit from 'jss-default-unit'
import expand from 'jss-expand'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'

type Options = {
  template?: {},
  global?: {},
  extend?: {},
  nested?: {},
  compose?: {},
  camelCase?: {},
  defaultUnit?: {},
  expand?: {},
  vendorPrefixer?: {},
  propsSort?: {}
}

export default (options: Options = {}) => ({
  plugins: [
    template(options.template),
    // global(options.global),
    extend(options.extend),
    nested(options.nested),
    compose(options.compose),
    camelCase(options.camelCase),
    defaultUnit(options.defaultUnit),
    expand(options.expand),
    vendorPrefixer(options.vendorPrefixer),
    propsSort(options.propsSort)
  ]
})
