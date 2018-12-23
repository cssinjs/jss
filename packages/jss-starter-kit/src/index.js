// @flow
import jss from 'jss'
import preset from 'jss-preset-default'

console.warn(`The JSS Starter Kit is for learning and experimentation.  It's not optimized for production deployment.

If you'd like to use JSS in production, try including the "jss" and "jss-preset-default" modules directly.  See an example at https://github.com/cssinjs/jss#example`)

jss.setup(preset())

export {jss, preset}

export * as reactJss from 'react-jss'
export {default as functions} from 'jss-plugin-syntax-rule-value-function'
export {default as observable} from 'jss-plugin-syntax-rule-value-observable'
export {default as template} from 'jss-plugin-syntax-template'
export {default as global} from 'jss-plugin-syntax-global'
export {default as extend} from 'jss-plugin-syntax-extend'
export {default as nested} from 'jss-plugin-syntax-nested'
export {default as compose} from 'jss-plugin-syntax-compose'
export {default as camelCase} from 'jss-plugin-syntax-camel-case'
export {default as defaultUnit} from 'jss-plugin-syntax-default-unit'
export {default as expand} from 'jss-plugin-syntax-expand'
export {default as vendorPrefixer} from 'jss-plugin-vendor-prefixer'
export {default as propsSort} from 'jss-plugin-props-sort'
export {default as isolate} from 'jss-plugin-isolate'
export {default as cache} from 'jss-plugin-cache'
