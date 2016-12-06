import extend from 'jss-extend'
import nested from 'jss-nested'
import camelCase from 'jss-camel-case'
import defaultUnit from 'jss-default-unit'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'
import compose from 'jss-compose'
import expand from 'jss-expand'

export default (options = {}) => ({
  plugins: [
    compose(options.compose),
    extend(options.extend),
    nested(options.nested),
    camelCase(options.camelCase),
    defaultUnit(options.defaultUnit),
    expand(options.expand),
    vendorPrefixer(options.vendorPrefixer),
    propsSort(options.propsSort)
  ]
})
