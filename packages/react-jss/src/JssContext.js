// @flow
import createReactContext, {type Context} from 'create-react-context'
import type {Context as JssContextValue} from './types'

const JssContext: Context<JssContextValue> = createReactContext({
  sheetOptions: {},
  disableStylesGeneration: false
})

export default JssContext
