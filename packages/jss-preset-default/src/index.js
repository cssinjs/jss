import global from 'jss-global'
import extend from 'jss-extend'
import nested from 'jss-nested'
import template from 'jss-template'
import compose from 'jss-compose'
import camelCase from 'jss-camel-case'
import defaultUnit from 'jss-default-unit'
import expand from 'jss-expand'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'

export default (options = {}) => ({
  plugins: [
    global(options.global),
    extend(options.extend),
    nested(options.nested),
    template(options.template),
    compose(options.compose),
    camelCase(options.camelCase),
    defaultUnit(options.defaultUnit),
    expand(options.expand),
    vendorPrefixer(options.vendorPrefixer),
    propsSort(options.propsSort)
  ]
})
