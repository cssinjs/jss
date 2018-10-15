/* @flow */
import warning from 'warning'
import RuleList from '../RuleList'
import type StyleSheet from '../StyleSheet'
import type {
  CSSKeyframesRule,
  JssStyle,
  Rule,
  RuleOptions,
  ToCssOptions,
  ContainerRule
} from '../types'

const defaultToStringOptions = {
  indent: 1,
  children: true
}

const nameRegExp = /@keyframes\s+([\w-]+)/

/**
 * Rule for @keyframes
 */
export class KeyframesRule implements ContainerRule {
  type = 'keyframes'

  at: string = '@keyframes'

  key: string

  name: string

  id: string

  rules: RuleList

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSKeyframesRule

  constructor(key: string, frames: Object, options: RuleOptions) {
    const nameMatch = key.match(nameRegExp)
    if (nameMatch && nameMatch[1]) {
      this.name = nameMatch[1]
    } else {
      this.name = 'noname'
      warning(false, '[JSS] Bad keyframes name %s', key)
    }
    this.key = `${this.type}-${this.name}`
    this.id = this.name
    this.options = options
    this.rules = new RuleList({...options, parent: this})

    for (const name in frames) {
      this.rules.add(name, frames[name], {
        ...this.options,
        parent: this,
        selector: name
      })
    }

    this.rules.process()
  }

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions = defaultToStringOptions): string {
    if (options.children === false) {
      return `${this.at} ${this.id} {}`
    }
    let children = this.rules.toString(options)
    if (children) children = `\n${children}\n`
    return `${this.at} ${this.id} {${children}}`
  }
}

const keyRegExp = /@keyframes\s+/

export const plugin = {
  queue: 1,

  onCreateRule(key: string, frames: JssStyle, options: RuleOptions): Rule | null {
    return keyRegExp.test(key) ? new KeyframesRule(key, frames, options) : null
  },

  // Animation name ref replacer.
  onProcessStyle: (style: JssStyle, rule: Rule, sheet?: StyleSheet) => {
    if (rule.type !== 'style' || !sheet) return style

    // We need to support camel case here, because this plugin runs before the camelization plugin.
    const prop = 'animation-name'
    const ref = style[prop]
    const isRef = ref && ref[0] === '$'
    if (!isRef) return style

    // We need to remove $ from $ref.
    const name = ref.substr(1)

    if (name in sheet.keyframes) {
      style[prop] = sheet.keyframes[name]
    } else {
      warning(false, '[JSS] Referenced keyframes rule "%s" is not defined.', name)
    }
    return style
  }
}
