/* @flow */
import Jss from './Jss'
import StyleSheet from './StyleSheet'
import ConditionalRule from './plugins/ConditionalRule'
import KeyframeRule from './plugins/KeyframeRule'
import RegularRule from './plugins/RegularRule'

export type ToCssOptions = {
  indent?: number
}

export type generateClassName = (rule: Rule, sheet?: StyleSheet) => string

// TODO
// Find a way to declare all types: Object|string|Array<Object>
export type JssStyle = Object

export type RuleOptions = {
  className?: string,
  selector?: string,
  generateClassName?: generateClassName,
  Renderer?: Function,
  index?: number,
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
  parent: ConditionalRule|KeyframeRule|StyleSheet
}

export interface Rule {
  type: string;
  name: ?string;
  selector: string;
  style: JssStyle;
  renderable: ?CSSStyleRule;
  options: RuleOptions;
  isProcessed: ?boolean;
  prop(name: string, value?: string): RegularRule|string;
  toString(options?: ToCssOptions): string;
}

export type Plugin = {
  onCreateRule?: (name: string, decl: JssStyle, options: RuleOptions) => Rule|null,
  onProcessRule?: (rule: Rule, sheet?: StyleSheet) => void,
  onProcessStyle?: (style: JssStyle, rule: Rule, sheet?: StyleSheet) => JssStyle,
  onProcessSheet?: (sheet?: StyleSheet) => void,
  onChangeValue?: (value: string, prop: string, rule: Rule) => string
}

export type InsertionPoint = string|HTMLElement

export type JssOptions = {
  generateClassName?: generateClassName,
  plugins?: Array<Plugin>,
  insertionPoint?: InsertionPoint,
  Renderer?: Class<Renderer>,
  virtual?: Boolean
}

export type InternalJssOptions = {
  generateClassName: generateClassName,
  plugins?: Array<Plugin>,
  insertionPoint: InsertionPoint,
  Renderer: Class<Renderer>
}

export type StyleSheetFactoryOptions = {
  media?: string,
  meta?: string,
  index?: number,
  link?: boolean,
  element?: HTMLStyleElement
}

export type StyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index: number,
  generateClassName: generateClassName,
  Renderer: Class<Renderer>,
  insertionPoint: InsertionPoint,
  jss: Jss
}

export type InternalStyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index: number,
  insertionPoint: InsertionPoint,
  Renderer: Class<Renderer>,
  generateClassName: generateClassName,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule|KeyframeRule|StyleSheet,
  classes: Object
}

export interface Renderer {
  constructor(sheet: StyleSheet): Renderer;
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
