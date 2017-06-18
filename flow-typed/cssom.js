declare type DOMString = string

declare interface CSSRuleBase<T> {
  +type: $PropertyType<T, 'type'>;
  +CSSRule: ?CSSRule;
  +CSSStyleSheet: ?CSSStyleSheet;
  cssText: DOMString;

  static STYLE_RULE: 1;
  static CHARSET_RULE: 2; // deprecated
  static IMPORT_RULE: 3;
  static MEDIA_RULE: 4;
  static FONT_FACE_RULE: 5;
  static PAGE_RULE: 6;
  static KEYFRAMES_RULE: 7;
  static KEYFRAME_RULE: 8;
  static NAMESPACE_RULE: 10;
  static COUNTER_STYLE_RULE: 11;
  static SUPPORTS_RULE: 12;
  static DOCUMENT_RULE: 13;
  static FONT_FEATURE_VALUES_RULE: 14;
  static VIEWPORT_RULE: 15;
  static REGION_STYLE_RULE: 16;
}

declare interface CSSStyleRule extends CSSRuleBase<{type: 1|1}> {
  +type: 1;
  +style: CSSStyleDeclaration;
  selectorText: DOMString;
}

declare interface CSSRuleList {
  length: number;
  [index: number]: CSSStyleRule;
}

declare interface CSSGroupingRule<T> extends CSSRuleBase<T> {
  +cssRules: CSSRuleList;
  insertRule(rule: DOMString, index: number): number;
  deleteRule(index: number): void;
}

declare interface CSSKeyframeRule extends CSSRuleBase<{type: 8|8}> {
  +type: 8;
  +style: CSSStyleDeclaration;
  keyText: DOMString;
}

declare interface CSSKeyframesRule extends CSSRuleBase<{type: 7|7}> {
  +type: 7;
  +cssRules: CSSRuleList;
  name: DOMString;
  appendRule(rule: DOMString): void;
  deleteRule(key: DOMString): void;
  findRule(key: DOMString): CSSKeyframeRule;
}

declare interface CSSMediaRule extends CSSGroupingRule<{type: 4|4}> {
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
