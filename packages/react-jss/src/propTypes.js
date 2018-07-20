import {func, shape} from 'prop-types'

export default {
  jss: shape({
    options: shape({
      createGenerateClassName: func.isRequired
    }).isRequired,
    createStyleSheet: func.isRequired,
    removeStyleSheet: func.isRequired
  }),
  registry: shape({
    add: func.isRequired,
    toString: func.isRequired
  })
}
