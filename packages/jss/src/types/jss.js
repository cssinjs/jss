/* @flow */
import Jss from '../Jss'
import StyleSheet from '../StyleSheet'
import ConditionalRule from '../rules/ConditionalRule'
import KeyframesRule from '../rules/KeyframesRule'
import StyleRule from '../rules/StyleRule'
import ViewportRule from '../rules/ViewportRule'
import SimpleRule from '../rules/SimpleRule'
import FontFaceRule from '../rules/FontFaceRule'
import type {CSSStyleRule} from './cssom'
import type RuleList from '../RuleList'

export type Classes = {[string]: string}

export type ToCssOptions = {
  indent?: number,
  allowEmpty?: boolean
}

export type UpdateOptions = {
  process: boolean
}

export type UpdateArguments =
  | [Object]
  | [Object, UpdateOptions]
  | [string, Object]
  | [string, Object, UpdateOptions]

export type Rule =
  | StyleRule
  | ConditionalRule
  | FontFaceRule
  | KeyframesRule
  | SimpleRule
  | ViewportRule

export type GenerateClassName = (rule: Rule, sheet?: StyleSheet) => string

// TODO
// Find a way to declare all types: Object|string|Array<Object>
export type JssStyle = Object

export type JssValue =
  | string
  | number
  | Array<string | number | Array<string | number> | '!important'>
  | null
  | false

export interface Renderer {
  constructor(sheet?: StyleSheet): void;
  setProperty(cssRule: HTMLElement | CSSStyleRule, prop: string, value: JssValue): boolean;
  getPropertyValue(cssRule: HTMLElement | CSSStyleRule, prop: string): string;
  removeProperty(cssRule: HTMLElement | CSSStyleRule, prop: string): void;
  setSelector(cssRule: CSSStyleRule, selectorText: string): boolean;
  attach(): void;
  detach(): void;
  deploy(sheet: StyleSheet): void;
  insertRule(rule: Rule): false | CSSRule;
  deleteRule(cssRule: CSSRule): boolean;
  replaceRule(cssRule: CSSRule, rule: Rule): false | CSSRule;
  indexOf(cssRule: CSSRule): number;
  getRules(): CSSRuleList | void;
}

export type RuleFactoryOptions = {
  selector?: string,
  classes?: Object,
  sheet?: StyleSheet,
  index?: number,
  jss?: Jss,
  generateClassName?: GenerateClassName,
  Renderer?: Class<Renderer>
}

export interface BaseRule {
  type: string;
  key: string;
  isProcessed: boolean;
  // eslint-disable-next-line no-use-before-define
  options: RuleOptions;
  toString(options?: ToCssOptions): string;
}

export interface ContainerRule extends BaseRule {
  rules: RuleList;
}

export type RuleOptions = {
  selector?: string,
  sheet?: StyleSheet,
  index?: number,
  parent?: ContainerRule | StyleSheet,
  classes: Classes,
  jss: Jss,
  generateClassName: GenerateClassName,
  Renderer: Class<Renderer>
}

export type RuleListOptions = {
  classes: Classes,
  generateClassName: GenerateClassName,
  Renderer: Class<Renderer>,
  jss: Jss,
  sheet: StyleSheet,
  parent: ContainerRule | StyleSheet
}

export type Plugin = {
  onCreateRule?: (name: string, decl: JssStyle, options: RuleOptions) => BaseRule | null,
  onProcessRule?: (rule: Rule, sheet?: StyleSheet) => void,
  onProcessStyle?: (style: JssStyle, rule: Rule, sheet?: StyleSheet) => JssStyle,
  onProcessSheet?: (sheet?: StyleSheet) => void,
  onChangeValue?: (value: string, prop: string, rule: StyleRule) => string | null | false,
  onUpdate?: (data: Object, rule: Rule, sheet: StyleSheet, options: UpdateOptions) => void
}

export type InsertionPoint = string | HTMLElement

type CreateGenerateClassName = () => GenerateClassName

export type JssOptions = {
  createGenerateClassName?: CreateGenerateClassName,
  plugins?: Array<Plugin>,
  insertionPoint?: InsertionPoint,
  Renderer?: Class<Renderer>,
  virtual?: Boolean
}

export type InternalJssOptions = {
  createGenerateClassName: CreateGenerateClassName,
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
  generateClassName?: GenerateClassName,
  classNamePrefix?: string
}

export type StyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index: number,
  generateClassName: GenerateClassName,
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
  generateClassName: GenerateClassName,
  classNamePrefix?: string,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule | KeyframesRule | StyleSheet,
  classes: Classes
}
