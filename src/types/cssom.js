// @flow

export type DOMString = string

export interface CSSRuleBase<T> {
  +type: $PropertyType<T, 'type'>;
  +CSSRule: ?CSSRule;
  +CSSStyleSheet: ?CSSStyleSheet;
  cssText: DOMString;
}

export interface CSSStyleRule extends CSSRuleBase<{type: 1 | 1}> {
  +type: 1;
  +style: CSSStyleDeclaration;
  selectorText: DOMString;
}

export interface CSSRuleList {
  length: number;
  [index: number]: CSSStyleRule;
}

export interface CSSGroupingRule<T> extends CSSRuleBase<T> {
  +cssRules: CSSRuleList;
  insertRule(rule: DOMString, index: number): number;
  deleteRule(index: number): void;
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

export type CSSOMRule = CSSStyleRule | CSSMediaRule | CSSKeyframesRule
