import {create} from '../../packages/jss/dist/jss.esm'
import preset from '../../packages/jss-preset-default/dist/jss-preset-default.esm'

// Exercise both imports so tree-shaking retains a configured JSS instance.
export default create(preset())
