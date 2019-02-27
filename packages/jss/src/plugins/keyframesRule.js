/* @flow */
import warning from 'tiny-warning'
import RuleList from '../RuleList'
import type {
  CSSKeyframesRule,
  JssStyle,
  RuleOptions,
  ToCssOptions,
  ContainerRule,
  KeyframesMap,
  Plugin
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

const findReferencedKeyframe = (val, keyframes) => {
  if (typeof val === 'string') {
    const ref = refRegExp.exec(val)

    if (!ref) return val

    if (ref[1] in keyframes) {
      return val.replace(ref[0], keyframes[ref[1]])
    }

    warning(false, `[JSS] Referenced keyframes rule "${ref[1]}" is not defined.`)
  }

  return val
}

/**
 * Replace the reference for a animation name.
 */
const replaceRef = (style: JssStyle, prop: string, keyframes: KeyframesMap) => {
  const value = style[prop]
  const refKeyframe = findReferencedKeyframe(value, keyframes)

  if (refKeyframe !== value) {
    style[prop] = refKeyframe
  }
}

const plugin: Plugin = {
  onCreateRule(key, frames, options) {
    return typeof key === 'string' && keyRegExp.test(key)
      ? new KeyframesRule(key, frames, options)
      : null
  },

  // Animation name ref replacer.
  onProcessStyle: (style, rule, sheet) => {
    if (rule.type !== 'style' || !sheet) return style

    if ('animation-name' in style) replaceRef(style, 'animation-name', sheet.keyframes)
    if ('animation' in style) replaceRef(style, 'animation', sheet.keyframes)
    return style
  },

  onChangeValue(val, prop, rule) {
    const {sheet} = rule.options

    if (!sheet) {
      return val
    }

    switch (prop) {
      case 'animation':
        return findReferencedKeyframe(val, sheet.keyframes)
      case 'animation-name':
        return findReferencedKeyframe(val, sheet.keyframes)
      default:
        return val
    }
  }
}

export default plugin
