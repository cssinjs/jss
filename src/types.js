/* @flow */
import Jss from './Jss'
import StyleSheet from './StyleSheet'
import ConditionalRule from './plugins/ConditionalRule'

export type ToCssOptions = {
  indent?: number
}

export type Plugin = {
  onCreateRule?: Function,
  onProcessRule?: Function
}

export type JssOptions = {
  generateClassName?: Function,
  plugins?: Array<Plugin>
}

/**
 * - `media` media query - attribute of style element.
 * - `meta` meta information about this style - attribute of style element,
 *   for e.g. you could pass
 * component name for easier debugging.
 * - `link` link jss `Rule` instances with DOM `CSSStyleRule` instances so that
 *   styles, can be modified
 * dynamically, false by default because it has some performance cost.
 * - `element` style element, will create one by default
 * - `index` 0 by default - determines DOM rendering order, higher number = higher specificity
 *  (inserted after)
 * - `virtual` if true, use VirtualRenderer
 */
export type StyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index?: number,
  virtual?: boolean,
  Renderer?: Function,
  generateClassName?: Function,
  jss: Jss
}

export type StyleSheetInstanceOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index: number,
  virtual?: boolean,
  Renderer: Function,
  generateClassName: Function,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule|StyleSheet,
  classes: Object
}

export type RuleOptions = {
  className?: string,
  selector?: string,
  generateClassName?: Function,
  Renderer?: Function,
  index?: number,
  virtual?: boolean,
  classes?: Object,
  jss?: Jss,
  sheet?: StyleSheet
}

export type RulesContainerOptions = {
  classes: Object,
  generateClassName: Function,
  Renderer: Function,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule|StyleSheet
}

export interface Rule {
  name: ?string;
  selector: string;
  renderable: ?CSSStyleRule;
  toString(): string;
}

export interface Renderer {
  setStyle(rule: HTMLElement|CSSStyleRule, prop: string, value: string): boolean;
  getStyle(rule: HTMLElement|CSSStyleRule, prop: string): string;
  setSelector(rule: CSSStyleRule, selectorText: string): boolean;
  getSelector(rule: CSSStyleRule): string;
  attach(): void;
  detach(): void;
  deploy(sheet: StyleSheet): void;
  insertRule(rule: Rule): CSSStyleRule;
  deleteRule(rule: CSSStyleRule): boolean;
  getRules(): CSSRuleList;
}
