import jss from 'jss'
import preset from 'jss-preset-default'

console.warn(`The JSS Starter Kit is for learning and experimentation.  It's not optimized for production deployment.

If you'd like to use JSS in production, try including the "jss" and "jss-preset-default" modules directly.  See an example at https://github.com/cssinjs/jss#example`)

jss.setup(preset())

export {jss as default, preset}

export * from 'jss'
export * from 'react-jss'

export {default as withStyles} from 'react-jss'

export {default as functions} from 'jss-plugin-rule-value-function'
export {default as observable} from 'jss-plugin-rule-value-observable'
export {default as template} from 'jss-plugin-template'
export {default as global} from 'jss-plugin-global'
export {default as extend} from 'jss-plugin-extend'
export {default as nested} from 'jss-plugin-nested'
export {default as compose} from 'jss-plugin-compose'
export {default as camelCase} from 'jss-plugin-camel-case'
export {default as defaultUnit} from 'jss-plugin-default-unit'
export {default as expand} from 'jss-plugin-expand'
export {default as vendorPrefixer} from 'jss-plugin-vendor-prefixer'
export {default as propsSort} from 'jss-plugin-props-sort'
export {default as isolate} from 'jss-plugin-isolate'
export {default as cache} from 'jss-plugin-cache'
