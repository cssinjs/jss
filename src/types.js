/* @flow */
import Jss from './Jss'
import StyleSheet from './StyleSheet'
import ConditionalRule from './plugins/ConditionalRule'

export type ToCssOptions = {
  indent?: number
}

export type generateClassName = (str: string, rule: Rule) => string

export type RuleOptions = {
  className?: string,
  selector?: string,
  generateClassName?: generateClassName,
  Renderer?: Function,
  index?: number,
  virtual?: boolean,
  classes?: Object,
  jss?: Jss,
  sheet?: StyleSheet
}

export type RulesContainerOptions = {
  classes: Object,
  generateClassName: generateClassName,
  Renderer: Function,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule|StyleSheet
}

export interface Rule {
  name: ?string;
  selector: string;
  style: Object;
  renderable: ?CSSStyleRule;
  options: RuleOptions;
  isProcessed: ?boolean;
  toString(options?: ToCssOptions): string;
}

export type Plugin = {
  onCreateRule?: (name: string, decl: Object, options: RuleOptions) => Rule|null,
  onProcessRule?: (rule: Rule, sheet?: StyleSheet) => void,
  onProcessSheet?: (sheet?: StyleSheet) => void
}

export type JssOptions = {
  generateClassName?: generateClassName,
  plugins?: Array<Plugin>,
  insertionPoint?: string
}

/**
 * - `media` media query - attribute of style element.
 * - `meta` meta information about this style - attribute of style element,
 *   for e.g. you could pass
 * component name for easier debugging.
 * - `index` 0 by default - determines DOM rendering order, higher number = higher specificity
 * - `insertionPoint` 'jss' by default, the value of a comment node sheets will be inserted after
 * - `link` link jss `Rule` instances with DOM `CSSStyleRule` instances so that
 *   styles, can be modified
 * dynamically, false by default because it has some performance cost.
 * - `element` style element, will create one by default
 *  (inserted after)
 * - `virtual` if true, use VirtualRenderer
 */
export type StyleSheetOptions = {
  media?: string,
  meta?: string,
  index?: number,
  insertionPoint?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  virtual?: boolean,
  Renderer?: Function,
  generateClassName?: generateClassName,
  jss: Jss
}

export type StyleSheetInstanceOptions = {
  media?: string,
  meta?: string,
  index: number,
  insertionPoint: string,
  link?: boolean,
  element?: HTMLStyleElement,
  virtual?: boolean,
  Renderer: Function,
  generateClassName: generateClassName,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule|StyleSheet,
  classes: Object
}

export interface Renderer {
  setStyle(rule: HTMLElement|CSSStyleRule, prop: string, value: string): boolean;
  getStyle(rule: HTMLElement|CSSStyleRule, prop: string): string;
  setSelector(rule: CSSStyleRule, selectorText: string): boolean;
  getSelector(rule: CSSStyleRule): string;
  attach(): void;
  detach(): void;
  deploy(sheet: StyleSheet): void;
  insertRule(rule: Rule): CSSStyleRule|false;
  deleteRule(rule: CSSStyleRule): boolean;
  getRules(): CSSRuleList|void;
}
