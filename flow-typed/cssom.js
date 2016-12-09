declare class CSSStyleRule extends CSSRule {
  style: CSSStyleDeclaration;
  selectorText: string;
}

declare class CSSRuleList {
  length: number;
  item(index: number): CSSStyleRule;
}
