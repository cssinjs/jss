// @flow
import createReactContext from 'create-react-context'
import type {Context} from './types'

const JssContext = createReactContext<Context>({
  sheetOptions: {},
  disableStylesGeneration: false
})

export default JssContext
