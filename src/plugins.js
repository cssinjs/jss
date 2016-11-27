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
 * Generate plugins which will register all rules.
 */
const plugins = Object.keys(classes).map((key) => {
  // https://jsperf.com/indexof-vs-substr-vs-regex-at-the-beginning-3
  const re = new RegExp(`^${key}`)
  const onCreate = (name, style, options) => (
    re.test(name) ? new classes[key](name, style, options) : null
  )
  return {onCreate}
})

export default plugins
