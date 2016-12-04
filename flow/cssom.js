declare class CSSStyleRule extends CSSRule {
  style: Object; // CSSStyleDeclaration;
  selectorText: string;
}

declare class CSSRuleList {
  length: number;
  item(index: number): CSSStyleRule;
}

declare interface JssRenderer {
  createElement(): void;
  style(): Function;
  selector(): Function;
  attach(): Function;
  detach(): Function;
  deploy(): Function;
  insertRule(): Function;
  deleteRule(rule: CSSStyleRule): boolean;
  getRules(): Function;
}
