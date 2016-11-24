import SimpleRule from './rules/SimpleRule'
import KeyframeRule from './rules/KeyframeRule'
import ConditionalRule from './rules/ConditionalRule'
import FontFaceRule from './rules/FontFaceRule'

const classes = {
  '@charset': SimpleRule,
  '@import': SimpleRule,
  '@namespace': SimpleRule,
  '@keyframes': KeyframeRule,
  '@media': ConditionalRule,
  '@supports': ConditionalRule,
  '@font-face': FontFaceRule
}

/**
 * Generate plugins which wil register all rules.
 */
const plugins = Object.keys(classes).map(name => ({
  onSetup: (jss, rulesFactory) => {
    rulesFactory.register(name, classes[name])
  }
}))

export default plugins
