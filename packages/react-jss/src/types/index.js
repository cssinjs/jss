// @flow
import type {
  InternalStyleSheetOptions,
  Rule,
  ToCssOptions,
  RuleOptions,
  JssStyle
} from 'jss/lib/types'
import RuleList from 'jss/lib/RuleList'
import {create} from '../jss'

export interface JssSheet {
  options: InternalStyleSheetOptions;
  linked: boolean;
  deployed: boolean;
  attached: boolean;
  rules: RuleList;
  renderer: Object;
  classes: Object;
  queue: ?Array<Rule>;
  attach(): JssSheet;
  detach(): JssSheet;
  addRule(name: string, decl: JssStyle, options?: RuleOptions): Rule;
  addRules(styles: Object, options?: RuleOptions): Array<Rule>;
  insertRule(rule: Rule): void;
  getRule(name: string): Rule;
  deleteRule(name: string): boolean;
  indexOf(rule: Rule): number;
  deploy(): any;
  link(): JssSheet;
  update(name?: string | Object, data?: Object): JssSheet;
  toString(options?: ToCssOptions): string;
}
export type Options = {
  theming?: {
    themeListener: any => any
  },
  inject?: Array<'classes' | 'themes' | 'sheet'>,
  jss?: create,
  ...$Shape<InternalStyleSheetOptions>
}
export type Theme = {}
export type Styles = {[string]: {}}
export type ThemerFn = (theme: Theme) => Styles
export type StylesOrThemer = Styles | ThemerFn
export type Classes<S> = {|
  [$Keys<S>]: string
|}
