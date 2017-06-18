import type RuleListType from '../RuleList'
import type {Rule} from './types'

export default (rule: Rule, data: Object, RuleList: RuleListType): void => {
  if (rule.type === 'style') {
    for (const prop in rule.style) {
      const value = rule.style[prop]
      if (typeof value === 'function') {
        rule.prop(prop, value(data))
      }
    }
  }
  else if (rule.rules instanceof RuleList) {
    rule.rules.update(data)
  }
}
