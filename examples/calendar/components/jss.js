// Setup jss plugins.
import {create} from 'jss'
import extend from 'jss-plugin-extend'
import nested from 'jss-plugin-nested'
import camelCase from 'jss-plugin-camel-case'
import defaultUnit from 'jss-plugin-default-unit'
import vendorPrefixer from 'jss-plugin-vendor-prefixer'

const jss = create()

jss.use(extend())
jss.use(nested())
jss.use(camelCase())
jss.use(defaultUnit())
jss.use(vendorPrefixer())

export default jss
