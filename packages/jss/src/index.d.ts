export type Style = {[key: string]: Style | any}
export type Styles<Name extends string = string> = Record<Name, Style>
export type Classes<Name extends string = string> = Record<Name, string>
export type Keyframes<Name extends string = string> = Record<Name, string>

export type GenerateId = (rule: Rule, sheet?: StyleSheet<string>) => string

export type JssValue =
  | string
  | number
  | Array<string | number | Array<string | number> | '!important'>
  | null
  | false

export type CreateGenerateId = () => GenerateId

export type InsertionPoint = string | HTMLElement

export interface UpdateOptions {
  process?: boolean
  force?: boolean
}

export interface ToCssOptions {
  indent?: number
  allowEmpty?: boolean
}

interface RuleListOptions {
  classes: Classes
  generateClassName: GenerateId
  Renderer: Renderer
  jss: Jss
  sheet: StyleSheet
  parent: ContainerRule | StyleSheet
}

declare class RuleList {
  constructor(options: RuleListOptions)
  add(name: string, decl: Style, options?: RuleOptions): Rule
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
  sheet?: StyleSheet
  index?: number
  parent?: ContainerRule | StyleSheet
  classes: Classes
  jss: Jss
  generateId: GenerateId
  Renderer: Renderer
}

interface BaseRule {
  type: string
  key: string
  isProcessed: boolean
  // eslint-disable-next-line no-use-before-define
  options: RuleOptions
  toString(options?: ToCssOptions): string
}

interface ContainerRule extends BaseRule {
  rules: RuleList
}

export interface Plugin {
  onCreateRule?(name: string, decl: Style, options: RuleOptions): Rule
  onProcessRule?(rule: Rule, sheet?: StyleSheet): void
  onProcessStyle?(style: Style, rule: Rule, sheet?: StyleSheet): Style
  onProcessSheet?(sheet?: StyleSheet): void
  onChangeValue?(value: string, prop: string, rule: Rule): string | null | false
  onUpdate?(data: object, rule: Rule, sheet?: StyleSheet): void
}

export type Rule = BaseRule | ContainerRule

export interface Renderer {
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

interface RuleFactoryOptions {
  selector?: string
  classes?: object
  sheet?: StyleSheet
  index?: number
  jss?: Jss
  generateId?: GenerateId
  Renderer?: Renderer
}

export interface StyleSheetFactoryOptions {
  media?: string
  meta?: string
  index?: number
  link?: boolean
  element?: HTMLStyleElement
  generateId?: GenerateId
  classNamePrefix?: string
}

interface StyleSheetOptions extends StyleSheetFactoryOptions {
  index: number
  generateId: GenerateId
  Renderer: Renderer
  insertionPoint?: InsertionPoint
  jss: Jss
}

declare class SheetsRegistry {
  readonly index: number
  add(sheet: StyleSheet<any>): void
  reset(): void
  remove(sheet: StyleSheet<any>): void
  toString(options?: ToCssOptions): string
}

declare class SheetsManager {
  readonly size: number
  get(key: object): StyleSheet | null
  add(key: object, sheet: StyleSheet): void
  manage(key: object): StyleSheet | null
  unmanage(key: object): void
}

export interface StyleSheet<RuleName extends string = string> {
  // Gives auto-completion on the rules declared in `createStyleSheet` without
  // causing errors for rules added dynamically after creation.
  classes: Classes<RuleName>
  keyframes: Keyframes<string>
  options: StyleSheetOptions
  linked: boolean
  attached: boolean
  /**
   * Attach renderable to the render tree.
   */
  attach(): this
  /**
   * Remove renderable from render tree.
   */
  detach(): this
  deploy(): this
  /**
   * Add a rule to the current stylesheet.
   * Will insert a rule also after the stylesheet has been rendered first time.
   */
  addRule(style: Style, options?: Partial<RuleOptions>): Rule
  addRule(name: RuleName, style: Style, options?: Partial<RuleOptions>): Rule

  insertRule(rule: Rule): void
  /**
   * Create and add rules.
   * Will render also after Style Sheet was rendered the first time.
   */
  addRules(styles: Partial<Styles<RuleName>>, options?: Partial<RuleOptions>): Rule[]
  /**
   * Get a rule by name.
   */
  getRule(name: RuleName): Rule
  /**
   * Delete a rule by name.
   * Returns `true`: if rule has been deleted from the DOM.
   */
  deleteRule(name: RuleName): boolean
  /**
   * Get index of a rule.
   */
  indexOf(rule: Rule): number
  /**
   * Update the function values with a new data.
   */
  update(name: string, data: object, options?: UpdateOptions): this
  update(data: object, options?: UpdateOptions): this
  /**
   * Convert rules to a CSS string.
   */
  toString(options?: ToCssOptions): string
}

export interface JssOptions {
  createGenerateId: CreateGenerateId
  plugins: ReadonlyArray<Plugin>
  Renderer?: Renderer | null
  insertionPoint: InsertionPoint
}

export interface Jss {
  createStyleSheet<Name extends string>(
    styles: Partial<Styles<Name>>,
    options?: StyleSheetFactoryOptions
  ): StyleSheet<Name>
  removeStyleSheet(sheet: StyleSheet): this
  setup(options?: Partial<JssOptions>): this
  use(...plugins: Plugin[]): this
  createRule(style: Style, options?: RuleFactoryOptions): Rule
  createRule<Name extends string>(name: Name, style: Style, options?: RuleFactoryOptions): Rule
}
/**
 * Creates a new instance of JSS.
 */
declare const sheets: SheetsRegistry
export {sheets, SheetsManager, SheetsRegistry, RuleList}
export function create(options?: Partial<JssOptions>): Jss
export function createGenerateId(): GenerateId
export function createRule(name: string, decl: Style, options: RuleOptions): Rule
export function toCssValue(value: JssValue, ignoreImportant: boolean): string
export function getDynamicStyles(styles: Styles): Styles | null
declare const jss: Jss

/**
 * A global JSS instance.
 */
export default jss
