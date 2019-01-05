type GenerateId = (rule: Rule, sheet?: StyleSheet<string>) => string

type CreateGenerateId = () => GenerateId

type JssValue =
  | string
  | number
  | Array<string | number | Array<string | number> | '!important'>
  | null
  | false

type JssStyle = object

type Styles<Name extends string> = Record<Name, object>

type Classes<Name extends string> = Record<Name, string>

type Keyframes<Name extends string> = Record<Name, string>

type InsertionPoint = string | HTMLElement

interface UpdateOptions {
  process?: boolean
  force?: boolean
}

interface RuleListOptions {
  classes: Classes<string>
  generateClassName: GenerateId
  Renderer: Renderer
  jss: Jss
  sheet: StyleSheet<string>
  parent: ContainerRule | StyleSheet<string>
}

interface ToCssOptions {
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

interface RuleOptions {
  selector?: string
  sheet?: StyleSheet<string>
  index?: number
  parent?: ContainerRule | StyleSheet<string>
  classes: Classes<string>
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
  onProcessRule?(rule: Rule, sheet?: StyleSheet<string>): void
  onProcessStyle?(style: JssStyle, rule: Rule, sheet?: StyleSheet<string>): JssStyle
  onProcessSheet?(sheet?: StyleSheet<string>): void
  onChangeValue?(value: string, prop: string, rule: Rule): string | null | false
  onUpdate?(data: object, rule: Rule, sheet?: StyleSheet<string>): void
}

type Rule = BaseRule | ContainerRule

declare class Renderer {
  constructor(sheet?: StyleSheet<string>)
  setProperty(cssRule: HTMLElement | CSSStyleRule, prop: string, value: JssValue): boolean
  getPropertyValue(cssRule: HTMLElement | CSSStyleRule, prop: string): string
  removeProperty(cssRule: HTMLElement | CSSStyleRule, prop: string): void
  setSelector(cssRule: CSSStyleRule, selectorText: string): boolean
  attach(): void
  detach(): void
  deploy(): void
  insertRule(rule: Rule): false | CSSRule
  deleteRule(cssRule: CSSRule): boolean
  replaceRule(cssRule: CSSRule, rule: Rule): false | CSSRule
  indexOf(cssRule: CSSRule): number
  getRules(): CSSRuleList | void
}

interface JssOptions {
  createGenerateId?: CreateGenerateId
  plugins?: Array<Plugin>
  insertionPoint?: InsertionPoint
  Renderer?: Renderer
  virtual?: boolean
}

interface RuleFactoryOptions {
  selector?: string
  classes?: object
  sheet?: StyleSheet<string>
  index?: number
  jss?: Jss
  generateId?: GenerateId
  Renderer?: Renderer
}

interface StyleSheetFactoryOptions {
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
  add(sheet: StyleSheet<string>): void
  reset(): void
  remove(sheet: StyleSheet<string>): void
  toString(options?: ToCssOptions): string
}

declare class SheetsManager {
  readonly size: number
  get(key: object): StyleSheet<string>
  add(key: object, sheet: StyleSheet<string>): number
  manage(key: object): StyleSheet<string>
  unmanage(key: object): void
}

interface StyleSheetOptions extends StyleSheetFactoryOptions {
  Renderer: Renderer
  insertionPoint?: InsertionPoint
  jss: Jss
}

declare class StyleSheet<ClassNames extends string, KeyframeNames extends string = string> {
  classes: Classes<ClassNames>
  keyframes: Keyframes<KeyframeNames>
  constructor(styles: Styles<ClassNames>, options: StyleSheetOptions)
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
  createStyleSheet<ClassNames extends string>(
    styles: Styles<ClassNames>,
    options?: StyleSheetFactoryOptions
  ): StyleSheet<ClassNames>
  removeStyleSheet(sheet: StyleSheet<string>): this
  setup(options?: JssOptions): this
  use(...plugins: Plugin[]): this
  createRule(style: JssStyle, options?: RuleFactoryOptions): Rule
  createRule(name: string, style: JssStyle, options?: RuleFactoryOptions): Rule
}

declare const sheets: SheetsRegistry
declare const jss: Jss

declare function create(options?: Partial<JssOptions>): Jss
declare function createGenerateId(): GenerateId
declare function createRule(name: string, decl: JssStyle, options: RuleOptions): Rule
declare function toCssValue(value: JssValue, ignoreImportant: boolean): string
declare function getDynamicStyles<ClassNames extends string>(
  styles: Styles<ClassNames>
): Styles<ClassNames> | null

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

/**
 * Actual exports
 */
export {
  SheetsRegistry,
  sheets,
  RuleList,
  SheetsManager,
  createGenerateId,
  create,
  createRule,
  toCssValue,
  getDynamicStyles
}

export default jss
