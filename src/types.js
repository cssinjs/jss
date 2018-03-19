/* @flow */
import Jss from './Jss'
import StyleSheet from './StyleSheet'
import ConditionalRule from './rules/ConditionalRule'
import KeyframesRule from './rules/KeyframesRule'
import StyleRule from './rules/StyleRule'
import ViewportRule from './rules/ViewportRule'
import SimpleRule from './rules/SimpleRule'
import FontFaceRule from './rules/FontFaceRule'

export type ToCssOptions = {
  indent?: number,
  allowEmpty?: boolean
}

export type Rule =
  | StyleRule
  | ConditionalRule
  | FontFaceRule
  | KeyframesRule
  | SimpleRule
  | ViewportRule

export type generateClassName = (rule: Rule, sheet?: StyleSheet) => string

// TODO
// Find a way to declare all types: Object|string|Array<Object>
export type JssStyle = Object

export type JssValue =
  | string
  | number
  | Array<string | number | Array<string | number> | '!important'>

export interface Renderer {
  constructor(sheet?: StyleSheet): void;
  setProperty(
    cssRule: HTMLElement | CSSStyleRule,
    prop: string,
    value: JssValue
  ): boolean;
  getPropertyValue(cssRule: HTMLElement | CSSStyleRule, prop: string): string;
  removeProperty(cssRule: HTMLElement | CSSStyleRule, prop: string): void;
  setSelector(cssRule: CSSStyleRule, selectorText: string): boolean;
  getKey(cssRule: CSSStyleRule): string;
  attach(): void;
  detach(): void;
  deploy(sheet: StyleSheet): void;
  insertRule(rule: Rule): false | CSSStyleRule;
  deleteRule(cssRule: CSSStyleRule): boolean;
  replaceRule(cssRule: CSSStyleRule, rule: Rule): false | CSSStyleRule;
  indexOf(cssRule: CSSStyleRule): number;
  getRules(): CSSRuleList | void;
}

export type RuleFactoryOptions = {
  selector?: string,
  classes?: Object,
  sheet?: StyleSheet,
  index?: number,
  jss?: Jss,
  generateClassName?: generateClassName,
  Renderer?: Class<Renderer>
}

export type RuleOptions = {
  selector?: string,
  sheet?: StyleSheet,
  index?: number,
  classes: Object,
  jss: Jss,
  generateClassName: generateClassName,
  Renderer: Class<Renderer>
}

export type RuleListOptions = {
  classes: Object,
  generateClassName: generateClassName,
  Renderer: Class<Renderer>,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule | KeyframesRule | StyleSheet
}

export interface BaseRule {
  type: string;
  key: string;
  isProcessed: boolean;
  options: RuleOptions;
  toString(options?: ToCssOptions): string;
}

export type Plugin = {
  onCreateRule?: (
    name: string,
    decl: JssStyle,
    options: RuleOptions
  ) => Rule | null,
  onProcessRule?: (rule: Rule, sheet?: StyleSheet) => void,
  onProcessStyle?: (
    style: JssStyle,
    rule: Rule,
    sheet?: StyleSheet
  ) => JssStyle,
  onProcessSheet?: (sheet?: StyleSheet) => void,
  onChangeValue?: (value: string, prop: string, rule: Rule) => string,
  onUpdate?: (data: Object, rule: Rule, sheet?: StyleSheet) => void
}

export type InsertionPoint = string | HTMLElement

type createGenerateClassName = () => generateClassName

export type JssOptions = {
  createGenerateClassName?: createGenerateClassName,
  plugins?: Array<Plugin>,
  insertionPoint?: InsertionPoint,
  Renderer?: Class<Renderer>,
  virtual?: Boolean
}

export type InternalJssOptions = {
  createGenerateClassName: createGenerateClassName,
  plugins: Array<Plugin>,
  insertionPoint?: InsertionPoint,
  Renderer: Class<Renderer>
}

export type StyleSheetFactoryOptions = {
  media?: string,
  meta?: string,
  index?: number,
  link?: boolean,
  element?: HTMLStyleElement,
  generateClassName?: generateClassName,
  classNamePrefix?: string
}

export type StyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index: number,
  generateClassName: generateClassName,
  classNamePrefix?: string,
  Renderer: Class<Renderer>,
  insertionPoint?: InsertionPoint,
  jss: Jss
}

export type InternalStyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index: number,
  insertionPoint?: InsertionPoint,
  Renderer: Class<Renderer>,
  generateClassName: generateClassName,
  classNamePrefix?: string,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule | KeyframesRule | StyleSheet,
  classes: Object
}

// These types are imported from indefinite-observable.  They should probably
// be moved to flow-typed.

export type Observable<T> = {
  subscribe(observerOrNext: ObserverOrNext<T>): Subscription
}

export type Observer<T> = {
  next: NextChannel<T>
}

export type NextChannel<T> = (value: T) => void
export type ObserverOrNext<T> = Observer<T> | NextChannel<T>

export type Unsubscribe = () => void
export type Subscription = {
  unsubscribe: Unsubscribe
}
