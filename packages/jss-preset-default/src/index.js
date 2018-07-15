import functions from 'jss-plugin-syntax-rule-value-function'
import observable from 'jss-plugin-syntax-rule-value-observable'
import template from 'jss-plugin-syntax-template'
import global from 'jss-plugin-syntax-global'
// import extend from 'jss-plugin-syntax-extend'
import nested from 'jss-plugin-syntax-nested'
import compose from 'jss-plugin-syntax-compose'
import camelCase from 'jss-plugin-syntax-camel-case'
// import defaultUnit from 'jss-plugin-syntax-default-unit'
// import expand from 'jss-plugin-syntax-expand'
import vendorPrefixer from 'jss-plugin-vendor-prefixer'
import propsSort from 'jss-plugin-props-sort'

export default (options = {}) => ({
  plugins: [
    functions(options.function),
    observable(options.observable),
    template(options.template),
    global(options.global),
    // extend(options.extend),
    nested(options.nested),
    compose(options.compose),
    camelCase(options.camelCase),
    // defaultUnit(options.defaultUnit),
    // expand(options.expand),
    vendorPrefixer(options.vendorPrefixer),
    propsSort(options.propsSort)
  ]
})
