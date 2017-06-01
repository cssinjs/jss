declare type DOMString = string

declare interface CSSStyleRule extends CSSRule {
  +type: 1;
  +style: CSSStyleDeclaration;
  selectorText: DOMString;
}

declare interface CSSRuleList {
  length: number;
  [index: number]: CSSStyleRule;
}

declare interface CSSGroupingRule extends CSSRule {
  +cssRules: CSSRuleList;
  insertRule(rule: DOMString, index: number): number;
  deleteRule(index: number): void;
}

declare interface CSSKeyframeRule extends CSSRule {
  +type: 8;
  +style: CSSStyleDeclaration;
  keyText: DOMString;
}

declare interface CSSKeyframesRule extends CSSRule {
  +type: 7;
  +cssRules: CSSRuleList;
  name: DOMString;
  appendRule(rule: DOMString): void;
  deleteRule(key: DOMString): void;
  findRule(key: DOMString): CSSKeyframeRule;
}

declare interface CSSMediaRule extends CSSGroupingRule {
  +type: 4;
  +mediaList: {
    +mediaText: DOMString,
    length: number,
    item?: DOMString,
    appendMedium(medium: DOMString): void,
    deleteMedium(medium: DOMString): void
  }
}

declare type CSSOMRule =
 | CSSStyleRule
 | CSSMediaRule
 | CSSKeyframesRule
