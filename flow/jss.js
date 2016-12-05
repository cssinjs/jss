declare type Plugin = {
  onCreateRule?: Function,
  onProcessRule?: Function
}

declare type JssOptions = {
  generateClassName?: Function,
  plugins?: Array<Plugin>
}

declare interface Renderer {
  createElement(): any;
  style(): any;
  selector(): any;
  attach(): any;
  detach(): any;
  deploy(): any;
  insertRule(): any;
  deleteRule(): any;
  getRules(): any;
}

/**
 * - `media` media query - attribute of style element.
 * - `meta` meta information about this style - attribute of style element,
 *   for e.g. you could pass
 * component name for easier debugging.
 * - `link` link jss `Rule` instances with DOM `CSSStyleRule` instances so that
 *   styles, can be modified
 * dynamically, false by default because it has some performance cost.
 * - `element` style element, will create one by default
 * - `index` 0 by default - determines DOM rendering order, higher number = higher specificity
 *  (inserted after)
 * - `virtual` if true, use VirtualRenderer
 */
declare type StyleSheetOptions = {
  media?: string,
  meta?: string,
  link?: boolean,
  element?: HTMLStyleElement,
  index?: number,
  virtual?: boolean,
  Renderer?: Renderer,
  generateClassName?: Function,
  jss?: any
}

declare type RuleOptions = {
  Renderer?: Renderer,
  generateClassName?: Function,
  index?: number,
  virtual?: boolean,
  jss: any,
  sheet: any,
  classes?: Object
}
