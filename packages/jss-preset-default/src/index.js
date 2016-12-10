import extend from 'jss-extend'
import nested from 'jss-nested'
import camelCase from 'jss-camel-case'
import defaultUnit from 'jss-default-unit'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'
import compose from 'jss-compose'
import expand from 'jss-expand'
import global from 'jss-global'

export default (options = {}) => ({
  plugins: [
    global(options.global),
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
