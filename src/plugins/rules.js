/* @flow */
import SimpleRule from '../rules/SimpleRule'
import KeyframesRule from '../rules/KeyframesRule'
import ConditionalRule from '../rules/ConditionalRule'
import FontFaceRule from '../rules/FontFaceRule'
import ViewportRule from '../rules/ViewportRule'
import type {Plugin, RuleOptions, Rule, JssStyle} from '../types'

const classes = {
  '@charset': SimpleRule,
  '@import': SimpleRule,
  '@namespace': SimpleRule,
  '@keyframes': KeyframesRule,
  '@media': ConditionalRule,
  '@supports': ConditionalRule,
  '@font-face': FontFaceRule,
  '@viewport': ViewportRule,
  '@-ms-viewport': ViewportRule
}

/**
 * Generate plugins which will register all rules.
 */
export default Object.keys(classes).map((key: string): Plugin => {
  // https://jsperf.com/indexof-vs-substr-vs-regex-at-the-beginning-3
  const re = new RegExp(`^${key}`)
  const onCreateRule = (name: string, decl: JssStyle, options: RuleOptions): Rule|null => (
    re.test(name) ? new classes[key](name, decl, options) : null
  )
  return {onCreateRule}
})
