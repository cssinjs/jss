/* @flow */
import warning from 'tiny-warning'
import RuleList from '../RuleList'
import type StyleSheet from '../StyleSheet'
import type {
  CSSKeyframesRule,
  JssStyle,
  Rule,
  RuleOptions,
  ToCssOptions,
  ContainerRule,
  KeyframesMap
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
      warning(false, `[JSS] Bad keyframes name ${key}`)
    }
    this.key = `${this.type}-${this.name}`
    this.options = options
    const {scoped, sheet, generateId} = options
    this.id = scoped === false ? this.name : generateId(this, sheet)
    this.rules = new RuleList({...options, parent: this})

    for (const name in frames) {
      this.rules.add(name, frames[name], {
        ...options,
        parent: this
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

const refRegExp = /\$([\w-]+)/

/**
 * Replace the reference for a animation name.
 */
const replaceRef = (style: JssStyle, prop: string, keyframes: KeyframesMap) => {
  const value = style[prop]

  if (typeof value === 'string') {
    const ref = refRegExp.exec(value)

    if (!ref) return

    if (ref[1] in keyframes) {
      style[prop] = value.replace(ref[0], keyframes[ref[1]])
    } else {
      warning(false, `[JSS] Referenced keyframes rule "${ref[1]}" is not defined.`)
    }
  }
}

export default {
  onCreateRule(key: string, frames: JssStyle, options: RuleOptions): KeyframesRule | null {
    return keyRegExp.test(key) ? new KeyframesRule(key, frames, options) : null
  },

  // Animation name ref replacer.
  onProcessStyle: (style: JssStyle, rule: Rule, sheet?: StyleSheet): JssStyle => {
    if (rule.type !== 'style' || !sheet) return style

    if ('animation-name' in style) replaceRef(style, 'animation-name', sheet.keyframes)
    if ('animation' in style) replaceRef(style, 'animation', sheet.keyframes)
    return style
  }
}
