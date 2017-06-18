/**
 * Link rule with CSSStyleRule and nested rules with corresponding nested cssRules if both exists.
 */
export default function linkRule(rule: Rule, cssRule: CSSOMRule): void {
  rule.renderable = cssRule
  if (rule.rules && cssRule.cssRules) rule.rules.link(cssRule.cssRules)
}
