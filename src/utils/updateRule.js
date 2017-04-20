import type RulesContainerType from '../RulesContainer'
import type {Rule} from './types'

export default (rule: Rule, data: Object, RulesContainer: RulesContainerType): void => {
  if (rule.type === 'regular') {
    for (const prop in rule.style) {
      const value = rule.style[prop]
      if (typeof value === 'function') {
        rule.prop(prop, value(data))
      }
    }
  }
  else if (rule.rules instanceof RulesContainer) {
    rule.rules.update(data)
  }
}
