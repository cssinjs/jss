// @flow

import type {DOMString} from './dom'

export interface StylePropertyMap {
  get(property: DOMString): DOMString;
  set(property: DOMString, value: DOMString): DOMString;
  delete(property: DOMString): void;
}

export interface CSSRuleBase<T> {
  +type: $PropertyType<T, 'type'>;
  +CSSRule: ?CSSRule;
  +CSSStyleSheet: ?CSSStyleSheet;
  cssText: DOMString;
  attributeStyleMap: StylePropertyMap;
}

export interface CSSGroupingRule<T> extends CSSRuleBase<T> {
  // eslint-disable-next-line no-use-before-define
  +cssRules: CSSRuleList;
  insertRule(rule: DOMString, index: number): number;
  deleteRule(index: number): void;
}

export interface CSSStyleRule extends CSSRuleBase<{type: 1 | 1}> {
  +type: 1;
  +style: CSSStyleDeclaration;
  selectorText: DOMString;
}

export interface CSSCharsetRule extends CSSRuleBase<{type: 2 | 2}> {
  +type: 2;
  charset: DOMString;
}

export interface CSSImportRule extends CSSRuleBase<{type: 3 | 3}> {
  +type: 3;
  +mediaList: {
    +mediaText: DOMString,
    length: number,
    item?: DOMString,
    appendMedium(medium: DOMString): void,
    deleteMedium(medium: DOMString): void
  };
}

export interface CSSMediaRule extends CSSGroupingRule<{type: 4 | 4}> {
  +type: 4;
  +mediaList: {
    +mediaText: DOMString,
    length: number,
    item?: DOMString,
    appendMedium(medium: DOMString): void,
    deleteMedium(medium: DOMString): void
  };
}

export interface CSSFontFaceRule extends CSSRuleBase<{type: 5 | 5}> {
  +type: 5;
  +style: CSSStyleDeclaration;
}

export interface CSSKeyframeRule extends CSSRuleBase<{type: 8 | 8}> {
  +type: 8;
  +style: CSSStyleDeclaration;
  keyText: DOMString;
}

export interface CSSKeyframesRule extends CSSRuleBase<{type: 7 | 7}> {
  +type: 7;
  +cssRules: CSSRuleList;
  name: DOMString;
  appendRule(rule: DOMString): void;
  deleteRule(key: DOMString): void;
  findRule(key: DOMString): CSSKeyframeRule;
}

export interface CSSNamespaceRule extends CSSRuleBase<{type: 10 | 10}> {
  +type: 10;
  namespaceURI: DOMString;
  prefix: DOMString;
}

export interface CSSViewportRule extends CSSRuleBase<{type: 15 | 15}> {
  +type: 15;
  +style: CSSStyleDeclaration;
}

export type AnyCSSRule =
  | CSSMediaRule
  | CSSFontFaceRule
  | CSSKeyframesRule
  | CSSCharsetRule
  | CSSImportRule
  | CSSNamespaceRule
  | CSSStyleRule
  | CSSViewportRule
