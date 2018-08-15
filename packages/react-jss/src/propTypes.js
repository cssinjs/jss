// @flow
import PropTypes from 'prop-types'

export default {
  jss: PropTypes.shape({
    options: PropTypes.shape({
      createGenerateClassName: PropTypes.func.isRequired
    }).isRequired,
    createStyleSheet: PropTypes.func.isRequired,
    removeStyleSheet: PropTypes.func.isRequired
  }),
  registry: PropTypes.shape({
    add: PropTypes.func.isRequired,
    toString: PropTypes.func.isRequired
  })
}
