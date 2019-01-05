type GenerateId = (rule: Rule, sheet?: StyleSheet) => string
type CreateGenerateId = () => GenerateId
type JssValue =
  | string
  | number
  | Array<string | number | Array<string | number> | '!important'>
  | null
  | false
type JssStyle = {}
type Classes = {[key: string]: string}
type Keyframes = {[key: string]: string}
type Styles = {[key: string]: JssStyle}
type InsertionPoint = string | HTMLElement
type UpdateOptions = {
  process?: boolean
  force?: boolean
}

type RuleListOptions = {
  classes: Classes
  generateClassName: GenerateId
  Renderer: Renderer
  jss: Jss
  sheet: StyleSheet
  parent: ContainerRule | StyleSheet
}

type ToCssOptions = {
  indent?: number
  allowEmpty?: boolean
}

declare class RuleList {
  constructor(options: RuleListOptions)
  add(name: string, decl: JssStyle, options?: RuleOptions): Rule
  get(name: string): Rule
  remove(rule: Rule): void
  indexOf(rule: Rule): number
  process(): void
  register(rule: Rule, className?: string): void
  unregister(rule: Rule): void
  update(name: string, data: {}): void
  update(data: {}): void
  toString(options?: ToCssOptions): string
}

type RuleOptions = {
  selector?: string
  sheet?: StyleSheet
  index?: number
  parent?: ContainerRule | StyleSheet
  classes: Classes
  jss: Jss
  generateId: GenerateId
  Renderer: Renderer
}

declare class BaseRule {
  type: string
  key: string
  isProcessed: boolean
  // eslint-disable-next-line no-use-before-define
  options: RuleOptions
  constructor(key: string, style: JssStyle, options: RuleOptions)
  toString(options?: ToCssOptions): string
}

interface ContainerRule extends BaseRule {
  rules: RuleList
}

interface Plugin {
  onCreateRule?(name: string, decl: JssStyle, options: RuleOptions): Rule
  onProcessRule?(rule: Rule, sheet?: StyleSheet): void
  onProcessStyle?(style: JssStyle, rule: Rule, sheet?: StyleSheet): JssStyle
  onProcessSheet?(sheet?: StyleSheet): void
  onChangeValue?(value: string, prop: string, rule: Rule): string | null | false
  onUpdate?(data: object, rule: Rule, sheet?: StyleSheet): void
}

type Rule = BaseRule | ContainerRule

declare class Renderer {
  constructor(sheet?: StyleSheet)
  setProperty(cssRule: HTMLElement | CSSStyleRule, prop: string, value: JssValue): boolean
  getPropertyValue(cssRule: HTMLElement | CSSStyleRule, prop: string): string
  removeProperty(cssRule: HTMLElement | CSSStyleRule, prop: string): void
  setSelector(cssRule: CSSStyleRule, selectorText: string): boolean
  attach(): void
  detach(): void
  deploy(sheet: StyleSheet): void
  insertRule(rule: Rule): false | CSSRule
  deleteRule(cssRule: CSSRule): boolean
  replaceRule(cssRule: CSSRule, rule: Rule): false | CSSRule
  indexOf(cssRule: CSSRule): number
  getRules(): CSSRuleList | void
}

type JssOptions = {
  createGenerateId?: CreateGenerateId
  plugins?: Array<Plugin>
  insertionPoint?: InsertionPoint
  Renderer?: Renderer
  virtual?: boolean
}
type RuleFactoryOptions = {
  selector?: string
  classes?: object
  sheet?: StyleSheet
  index?: number
  jss?: Jss
  generateId?: GenerateId
  Renderer?: Renderer
}

type StyleSheetFactoryOptions = {
  media?: string
  meta?: string
  index?: number
  link?: boolean
  element?: HTMLStyleElement
  generateId?: GenerateId
  classNamePrefix?: string
}

declare class SheetsRegistry {
  readonly index: number
  add(sheet: StyleSheet): void
  reset(): void
  remove(sheet: StyleSheet): void
  toString(options?: ToCssOptions): string
}

declare class SheetsManager {
  readonly size: number
  get(key: object): StyleSheet
  add(key: object, sheet: StyleSheet): number
  manage(key: object): StyleSheet
  unmanage(key: object): void
}

type StyleSheetOptions = {
  media?: string
  meta?: string
  link?: boolean
  element?: HTMLStyleElement
  index: number
  generateId: GenerateId
  classNamePrefix?: string
  Renderer: Renderer
  insertionPoint?: InsertionPoint
  jss: Jss
}

declare class StyleSheet {
  classes: Classes
  keyframes: Keyframes
  constructor(styles: object, options: StyleSheetOptions)
  attach(): this
  detach(): this
  addRule(name: string, decl: JssStyle, options?: RuleOptions): Rule
  insertRule(rule: Rule): void
  addRules(styles: object, options?: RuleOptions): Array<Rule>
  getRule(name: string): Rule
  deleteRule(name: string): boolean
  indexOf(rule: Rule): number
  deploy(): this
  update(name: string, data: object, options?: UpdateOptions): this
  update(data: object, options?: UpdateOptions): this
  toString(options?: ToCssOptions): string
}

declare class Jss {
  constructor(options?: JssOptions)
  createStyleSheet(styles: Styles, options?: StyleSheetFactoryOptions): StyleSheet
  removeStyleSheet(sheet: StyleSheet): this
  setup(options?: JssOptions): this
  use(...plugins: Plugin[]): this
  createRule(style: JssStyle, options?: RuleFactoryOptions): Rule
  createRule(name: string, style: JssStyle, options?: RuleFactoryOptions): Rule
}

/**
 * Type exports
 */
export {
  Jss,
  StyleSheet,
  BaseRule,
  ContainerRule,
  JssValue,
  JssOptions,
  StyleSheetFactoryOptions,
  Styles,
  JssStyle,
  Plugin,
  CreateGenerateId,
  GenerateId,
  RuleListOptions,
  Rule,
  Renderer,
  RuleOptions,
  Classes,
  UpdateOptions
}

/*
 * Actual exports
 */
declare const sheets: SheetsRegistry
export {SheetsRegistry, sheets, RuleList, SheetsManager}
export function create(options?: Partial<JssOptions>): Jss
export function createGenerateId(): GenerateId
export function createRule(name: string, decl: JssStyle, options: RuleOptions): Rule
export function toCssValue(value: JssValue, ignoreImportant: boolean): string
export function getDynamicStyles(styles: Styles): Styles | null
declare const jss: Jss

export default jss
