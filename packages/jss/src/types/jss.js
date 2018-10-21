/* @flow */
import Jss from '../Jss'
import StyleSheet from '../StyleSheet'
import {ConditionalRule} from '../plugins/conditionalRule'
import {KeyframesRule} from '../plugins/keyframesRule'
import {StyleRule} from '../plugins/styleRule'
import {ViewportRule} from '../plugins/viewportRule'
import {SimpleRule} from '../plugins/simpleRule'
import {FontFaceRule} from '../plugins/fontFaceRule'
import type {CSSStyleRule} from './cssom'
import type RuleList from '../RuleList'

export type Classes = {[string]: string}

export type KeyframesMap = {[string]: string}

export type ToCssOptions = {
  indent?: number,
  allowEmpty?: boolean,
  children?: boolean
}

export type UpdateOptions = {
  process?: boolean,
  force?: boolean
}

export type UpdateArguments =
  | [Object]
  | [Object, UpdateOptions]
  | [string, Object]
  | [string, Object, UpdateOptions]

export interface BaseRule {
  type: string;
  // Key is used as part of a class name and keyframes-name. It has to be
  // a valid CSS identifier https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  key: string;
  isProcessed: boolean;
  // eslint-disable-next-line no-use-before-define
  options: RuleOptions;
  renderable?: Object | null | void;
  toString(options?: ToCssOptions): string;
}

export type Rule =
  | StyleRule
  | ConditionalRule
  | FontFaceRule
  | KeyframesRule
  | SimpleRule
  | ViewportRule
  | BaseRule

export type GenerateId = (rule: Rule, sheet?: StyleSheet) => string

// TODO
// Find a way to declare all types: Object|string|Array<Object>
export type JssStyle = Object

export type JssValue =
  | string
  | number
  | Array<string | number | Array<string | number> | '!important'>
  | Object
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
  classes?: Classes,
  keyframes?: KeyframesMap,
  sheet?: StyleSheet,
  index?: number,
  jss?: Jss,
  generateId?: GenerateId,
  Renderer?: Class<Renderer>
}

export interface ContainerRule extends BaseRule {
  at: string;
  rules: RuleList;
}

export type RuleOptions = {
  selector?: string,
  scoped?: boolean,
  sheet?: StyleSheet,
  index?: number,
  parent?: ContainerRule | StyleSheet,
  classes: Classes,
  keyframes: KeyframesMap,
  jss: Jss,
  generateId: GenerateId,
  Renderer: Class<Renderer>
}

export type RuleListOptions = {
  classes: Classes,
  scoped?: boolean,
  keyframes: KeyframesMap,
  generateId: GenerateId,
  Renderer: Class<Renderer>,
  jss: Jss,
  sheet: StyleSheet,
  parent: ContainerRule | StyleSheet
}

export type OnCreateRule = (name?: string, decl: JssStyle, options: RuleOptions) => BaseRule | null
export type OnProcessRule = (rule: Rule, sheet?: StyleSheet) => void
export type OnProcessStyle = (style: JssStyle, rule: Rule, sheet?: StyleSheet) => JssStyle
export type OnProcessSheet = (sheet?: StyleSheet) => void
export type OnChangeValue = (value: JssValue, prop: string, rule: StyleRule) => JssValue
export type OnUpdate = (data: Object, rule: Rule, sheet: StyleSheet, options: UpdateOptions) => void

export type Plugin = {
  onCreateRule?: OnCreateRule,
  onProcessRule?: OnProcessRule,
  onProcessStyle?: OnProcessStyle,
  onProcessSheet?: OnProcessSheet,
  onChangeValue?: OnChangeValue,
  onUpdate?: OnUpdate
}

export type InsertionPoint = string | HTMLElement

type CreateGenerateId = () => GenerateId

export type JssOptions = {
  createGenerateId?: CreateGenerateId,
  plugins?: Array<Plugin>,
  insertionPoint?: InsertionPoint,
  Renderer?: Class<Renderer>,
  virtual?: Boolean
}

export type InternalJssOptions = {
  createGenerateId: CreateGenerateId,
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
  generateId?: GenerateId,
  classNamePrefix?: string
}

export type StyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index: number,
  generateId: GenerateId,
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
  generateId: GenerateId,
  classNamePrefix?: string,
  jss: Jss,
  sheet: StyleSheet,
  parent: ConditionalRule | KeyframesRule | StyleSheet,
  classes: Classes
}
