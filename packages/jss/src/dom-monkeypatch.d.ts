/**
 * Problem: jss doesn't depend on browser env but the types do.
 * Workaround: Copy/paste subset of interfaces from `dom.d.ts` (TS v3.7.2):
 * - `CSSStyleRule`
 * - `StyleSheet`
 * - `CSSRule`
 *
 * Note: Typescript interfaces nicely merge when full dom types are present, but `declare var` doesn't.
 */

/** A single CSS rule. There are several types of rules, listed in the Type constants section below. */
interface CSSRule {
  cssText: string
  readonly parentRule: CSSRule | null
  readonly parentStyleSheet: CSSStyleSheet | null
  readonly type: number
  readonly CHARSET_RULE: number
  readonly FONT_FACE_RULE: number
  readonly IMPORT_RULE: number
  readonly KEYFRAMES_RULE: number
  readonly KEYFRAME_RULE: number
  readonly MEDIA_RULE: number
  readonly NAMESPACE_RULE: number
  readonly PAGE_RULE: number
  readonly STYLE_RULE: number
  readonly SUPPORTS_RULE: number
  readonly UNKNOWN_RULE: number
  readonly VIEWPORT_RULE: number
}

/** A CSSRuleList is an (indirect-modify only) array-like object containing an ordered collection of CSSRule objects. */
interface CSSRuleList {
  readonly length: number
  item(index: number): CSSRule | null
  // [index: number]: CSSRule  // Index signatures does not merge nicely.
}

/** An object that is a CSS declaration block, and exposes style information and various style-related methods and properties. */
interface CSSStyleDeclaration {
  alignContent: string
  alignItems: string
  alignSelf: string
  alignmentBaseline: string
  animation: string
  animationDelay: string
  animationDirection: string
  animationDuration: string
  animationFillMode: string
  animationIterationCount: string
  animationName: string
  animationPlayState: string
  animationTimingFunction: string
  backfaceVisibility: string
  background: string
  backgroundAttachment: string
  backgroundClip: string
  backgroundColor: string
  backgroundImage: string
  backgroundOrigin: string
  backgroundPosition: string
  backgroundPositionX: string
  backgroundPositionY: string
  backgroundRepeat: string
  backgroundSize: string
  baselineShift: string
  blockSize: string
  border: string
  borderBlockEnd: string
  borderBlockEndColor: string
  borderBlockEndStyle: string
  borderBlockEndWidth: string
  borderBlockStart: string
  borderBlockStartColor: string
  borderBlockStartStyle: string
  borderBlockStartWidth: string
  borderBottom: string
  borderBottomColor: string
  borderBottomLeftRadius: string
  borderBottomRightRadius: string
  borderBottomStyle: string
  borderBottomWidth: string
  borderCollapse: string
  borderColor: string
  borderImage: string
  borderImageOutset: string
  borderImageRepeat: string
  borderImageSlice: string
  borderImageSource: string
  borderImageWidth: string
  borderInlineEnd: string
  borderInlineEndColor: string
  borderInlineEndStyle: string
  borderInlineEndWidth: string
  borderInlineStart: string
  borderInlineStartColor: string
  borderInlineStartStyle: string
  borderInlineStartWidth: string
  borderLeft: string
  borderLeftColor: string
  borderLeftStyle: string
  borderLeftWidth: string
  borderRadius: string
  borderRight: string
  borderRightColor: string
  borderRightStyle: string
  borderRightWidth: string
  borderSpacing: string
  borderStyle: string
  borderTop: string
  borderTopColor: string
  borderTopLeftRadius: string
  borderTopRightRadius: string
  borderTopStyle: string
  borderTopWidth: string
  borderWidth: string
  bottom: string
  boxShadow: string
  boxSizing: string
  breakAfter: string
  breakBefore: string
  breakInside: string
  captionSide: string
  caretColor: string
  clear: string
  clip: string
  clipPath: string
  clipRule: string
  color: string | null
  colorInterpolation: string
  colorInterpolationFilters: string
  columnCount: string
  columnFill: string
  columnGap: string
  columnRule: string
  columnRuleColor: string
  columnRuleStyle: string
  columnRuleWidth: string
  columnSpan: string
  columnWidth: string
  columns: string
  content: string
  counterIncrement: string
  counterReset: string
  cssFloat: string | null
  cssText: string
  cursor: string
  direction: string
  display: string
  dominantBaseline: string
  emptyCells: string
  enableBackground: string | null
  fill: string
  fillOpacity: string
  fillRule: string
  filter: string
  flex: string
  flexBasis: string
  flexDirection: string
  flexFlow: string
  flexGrow: string
  flexShrink: string
  flexWrap: string
  float: string
  floodColor: string
  floodOpacity: string
  font: string
  fontFamily: string
  fontFeatureSettings: string
  fontKerning: string
  fontSize: string
  fontSizeAdjust: string
  fontStretch: string
  fontStyle: string
  fontSynthesis: string
  fontVariant: string
  fontVariantCaps: string
  fontVariantEastAsian: string
  fontVariantLigatures: string
  fontVariantNumeric: string
  fontVariantPosition: string
  fontWeight: string
  gap: string
  glyphOrientationHorizontal: string | null
  glyphOrientationVertical: string
  grid: string
  gridArea: string
  gridAutoColumns: string
  gridAutoFlow: string
  gridAutoRows: string
  gridColumn: string
  gridColumnEnd: string
  gridColumnGap: string
  gridColumnStart: string
  gridGap: string
  gridRow: string
  gridRowEnd: string
  gridRowGap: string
  gridRowStart: string
  gridTemplate: string
  gridTemplateAreas: string
  gridTemplateColumns: string
  gridTemplateRows: string
  height: string
  hyphens: string
  imageOrientation: string
  imageRendering: string
  imeMode: string | null
  inlineSize: string
  justifyContent: string
  justifyItems: string
  justifySelf: string
  kerning: string | null
  layoutGrid: string | null
  layoutGridChar: string | null
  layoutGridLine: string | null
  layoutGridMode: string | null
  layoutGridType: string | null
  left: string
  readonly length: number
  letterSpacing: string
  lightingColor: string
  lineBreak: string
  lineHeight: string
  listStyle: string
  listStyleImage: string
  listStylePosition: string
  listStyleType: string
  margin: string
  marginBlockEnd: string
  marginBlockStart: string
  marginBottom: string
  marginInlineEnd: string
  marginInlineStart: string
  marginLeft: string
  marginRight: string
  marginTop: string
  marker: string
  markerEnd: string
  markerMid: string
  markerStart: string
  mask: string
  maskComposite: string
  maskImage: string
  maskPosition: string
  maskRepeat: string
  maskSize: string
  maskType: string
  maxBlockSize: string
  maxHeight: string
  maxInlineSize: string
  maxWidth: string
  minBlockSize: string
  minHeight: string
  minInlineSize: string
  minWidth: string
  msContentZoomChaining: string | null
  msContentZoomLimit: string | null
  msContentZoomLimitMax: any
  msContentZoomLimitMin: any
  msContentZoomSnap: string | null
  msContentZoomSnapPoints: string | null
  msContentZoomSnapType: string | null
  msContentZooming: string | null
  msFlowFrom: string | null
  msFlowInto: string | null
  msFontFeatureSettings: string | null
  msGridColumn: any
  msGridColumnAlign: string | null
  msGridColumnSpan: any
  msGridColumns: string | null
  msGridRow: any
  msGridRowAlign: string | null
  msGridRowSpan: any
  msGridRows: string | null
  msHighContrastAdjust: string | null
  msHyphenateLimitChars: string | null
  msHyphenateLimitLines: any
  msHyphenateLimitZone: any
  msHyphens: string | null
  msImeAlign: string | null
  msOverflowStyle: string | null
  msScrollChaining: string | null
  msScrollLimit: string | null
  msScrollLimitXMax: any
  msScrollLimitXMin: any
  msScrollLimitYMax: any
  msScrollLimitYMin: any
  msScrollRails: string | null
  msScrollSnapPointsX: string | null
  msScrollSnapPointsY: string | null
  msScrollSnapType: string | null
  msScrollSnapX: string | null
  msScrollSnapY: string | null
  msScrollTranslation: string | null
  msTextCombineHorizontal: string | null
  msTextSizeAdjust: any
  msTouchAction: string | null
  msTouchSelect: string | null
  msUserSelect: string | null
  msWrapFlow: string
  msWrapMargin: any
  msWrapThrough: string
  objectFit: string
  objectPosition: string
  opacity: string | null
  order: string
  orphans: string
  outline: string
  outlineColor: string
  outlineOffset: string
  outlineStyle: string
  outlineWidth: string
  overflow: string
  overflowAnchor: string
  overflowWrap: string
  overflowX: string
  overflowY: string
  padding: string
  paddingBlockEnd: string
  paddingBlockStart: string
  paddingBottom: string
  paddingInlineEnd: string
  paddingInlineStart: string
  paddingLeft: string
  paddingRight: string
  paddingTop: string
  pageBreakAfter: string
  pageBreakBefore: string
  pageBreakInside: string
  paintOrder: string
  readonly parentRule: CSSRule
  penAction: string | null
  perspective: string
  perspectiveOrigin: string
  placeContent: string
  placeItems: string
  placeSelf: string
  pointerEvents: string | null
  position: string
  quotes: string
  resize: string
  right: string
  rotate: string
  rowGap: string
  rubyAlign: string | null
  rubyOverhang: string | null
  rubyPosition: string | null
  scale: string
  scrollBehavior: string
  shapeRendering: string
  stopColor: string | null
  stopOpacity: string | null
  stroke: string
  strokeDasharray: string
  strokeDashoffset: string
  strokeLinecap: string
  strokeLinejoin: string
  strokeMiterlimit: string
  strokeOpacity: string
  strokeWidth: string
  tabSize: string
  tableLayout: string
  textAlign: string
  textAlignLast: string
  textAnchor: string | null
  textCombineUpright: string
  textDecoration: string
  textDecorationColor: string
  textDecorationLine: string
  textDecorationStyle: string
  textEmphasis: string
  textEmphasisColor: string
  textEmphasisPosition: string
  textEmphasisStyle: string
  textIndent: string
  textJustify: string
  textKashida: string | null
  textKashidaSpace: string | null
  textOrientation: string
  textOverflow: string
  textRendering: string
  textShadow: string
  textTransform: string
  textUnderlinePosition: string
  top: string
  touchAction: string
  transform: string
  transformBox: string
  transformOrigin: string
  transformStyle: string
  transition: string
  transitionDelay: string
  transitionDuration: string
  transitionProperty: string
  transitionTimingFunction: string
  translate: string
  unicodeBidi: string
  userSelect: string
  verticalAlign: string
  visibility: string
  /** @deprecated */
  webkitAlignContent: string
  /** @deprecated */
  webkitAlignItems: string
  /** @deprecated */
  webkitAlignSelf: string
  /** @deprecated */
  webkitAnimation: string
  /** @deprecated */
  webkitAnimationDelay: string
  /** @deprecated */
  webkitAnimationDirection: string
  /** @deprecated */
  webkitAnimationDuration: string
  /** @deprecated */
  webkitAnimationFillMode: string
  /** @deprecated */
  webkitAnimationIterationCount: string
  /** @deprecated */
  webkitAnimationName: string
  /** @deprecated */
  webkitAnimationPlayState: string
  /** @deprecated */
  webkitAnimationTimingFunction: string
  /** @deprecated */
  webkitAppearance: string
  /** @deprecated */
  webkitBackfaceVisibility: string
  /** @deprecated */
  webkitBackgroundClip: string
  /** @deprecated */
  webkitBackgroundOrigin: string
  /** @deprecated */
  webkitBackgroundSize: string
  /** @deprecated */
  webkitBorderBottomLeftRadius: string
  /** @deprecated */
  webkitBorderBottomRightRadius: string
  webkitBorderImage: string | null
  /** @deprecated */
  webkitBorderRadius: string
  /** @deprecated */
  webkitBorderTopLeftRadius: string
  /** @deprecated */
  webkitBorderTopRightRadius: string
  /** @deprecated */
  webkitBoxAlign: string
  webkitBoxDirection: string | null
  /** @deprecated */
  webkitBoxFlex: string
  /** @deprecated */
  webkitBoxOrdinalGroup: string
  webkitBoxOrient: string | null
  /** @deprecated */
  webkitBoxPack: string
  /** @deprecated */
  webkitBoxShadow: string
  /** @deprecated */
  webkitBoxSizing: string
  webkitColumnBreakAfter: string | null
  webkitColumnBreakBefore: string | null
  webkitColumnBreakInside: string | null
  webkitColumnCount: any
  webkitColumnGap: any
  webkitColumnRule: string | null
  webkitColumnRuleColor: any
  webkitColumnRuleStyle: string | null
  webkitColumnRuleWidth: any
  webkitColumnSpan: string | null
  webkitColumnWidth: any
  webkitColumns: string | null
  /** @deprecated */
  webkitFilter: string
  /** @deprecated */
  webkitFlex: string
  /** @deprecated */
  webkitFlexBasis: string
  /** @deprecated */
  webkitFlexDirection: string
  /** @deprecated */
  webkitFlexFlow: string
  /** @deprecated */
  webkitFlexGrow: string
  /** @deprecated */
  webkitFlexShrink: string
  /** @deprecated */
  webkitFlexWrap: string
  /** @deprecated */
  webkitJustifyContent: string
  webkitLineClamp: string
  /** @deprecated */
  webkitMask: string
  /** @deprecated */
  webkitMaskBoxImage: string
  /** @deprecated */
  webkitMaskBoxImageOutset: string
  /** @deprecated */
  webkitMaskBoxImageRepeat: string
  /** @deprecated */
  webkitMaskBoxImageSlice: string
  /** @deprecated */
  webkitMaskBoxImageSource: string
  /** @deprecated */
  webkitMaskBoxImageWidth: string
  /** @deprecated */
  webkitMaskClip: string
  /** @deprecated */
  webkitMaskComposite: string
  /** @deprecated */
  webkitMaskImage: string
  /** @deprecated */
  webkitMaskOrigin: string
  /** @deprecated */
  webkitMaskPosition: string
  /** @deprecated */
  webkitMaskRepeat: string
  /** @deprecated */
  webkitMaskSize: string
  /** @deprecated */
  webkitOrder: string
  /** @deprecated */
  webkitPerspective: string
  /** @deprecated */
  webkitPerspectiveOrigin: string
  webkitTapHighlightColor: string | null
  /** @deprecated */
  webkitTextFillColor: string
  /** @deprecated */
  webkitTextSizeAdjust: string
  /** @deprecated */
  webkitTextStroke: string
  /** @deprecated */
  webkitTextStrokeColor: string
  /** @deprecated */
  webkitTextStrokeWidth: string
  /** @deprecated */
  webkitTransform: string
  /** @deprecated */
  webkitTransformOrigin: string
  /** @deprecated */
  webkitTransformStyle: string
  /** @deprecated */
  webkitTransition: string
  /** @deprecated */
  webkitTransitionDelay: string
  /** @deprecated */
  webkitTransitionDuration: string
  /** @deprecated */
  webkitTransitionProperty: string
  /** @deprecated */
  webkitTransitionTimingFunction: string
  webkitUserModify: string | null
  webkitUserSelect: string | null
  webkitWritingMode: string | null
  whiteSpace: string
  widows: string
  width: string
  willChange: string
  wordBreak: string
  wordSpacing: string
  wordWrap: string
  writingMode: string
  zIndex: string
  zoom: string | null
  getPropertyPriority(propertyName: string): string
  getPropertyValue(propertyName: string): string
  item(index: number): string
  removeProperty(propertyName: string): string
  setProperty(propertyName: string, value: string | null, priority?: string | null): void
  // [index: number]: string  // Index signatures does not merge nicely.
}

/** CSSStyleRule represents a single CSS style rule. It implements the CSSRule interface with a type value of 1 (CSSRule.STYLE_RULE). */
interface CSSStyleRule extends CSSRule {
  selectorText: string
  readonly style: CSSStyleDeclaration
}

/** A single CSS style sheet. It inherits properties and methods from its parent, StyleSheet. */
interface CSSStyleSheet extends StyleSheet {
  readonly cssRules: CSSRuleList
  /** @deprecated */
  cssText: string
  /** @deprecated */
  readonly id: string
  /** @deprecated */
  readonly imports: StyleSheetList
  /** @deprecated */
  readonly isAlternate: boolean
  /** @deprecated */
  readonly isPrefAlternate: boolean
  readonly ownerRule: CSSRule | null
  /** @deprecated */
  readonly owningElement: Element
  /** @deprecated */
  readonly pages: any
  /** @deprecated */
  readonly readOnly: boolean
  readonly rules: CSSRuleList
  /** @deprecated */
  addImport(bstrURL: string, lIndex?: number): number
  /** @deprecated */
  addPageRule(bstrSelector: string, bstrStyle: string, lIndex?: number): number
  addRule(bstrSelector: string, bstrStyle?: string, lIndex?: number): number
  deleteRule(index?: number): void
  insertRule(rule: string, index?: number): number
  /** @deprecated */
  removeImport(lIndex: number): void
  removeRule(lIndex: number): void
}

interface MediaList {
  readonly length: number
  mediaText: string
  appendMedium(medium: string): void
  deleteMedium(medium: string): void
  item(index: number): string | null
  toString(): number
  // [index: number]: string  // Index signatures does not merge nicely.
}

/** A single style sheet. CSS style sheets will further implement the more specialized CSSStyleSheet interface. */
interface StyleSheet {
  disabled: boolean
  readonly href: string | null
  readonly media: MediaList
  // readonly ownerNode: Node
  readonly parentStyleSheet: StyleSheet | null
  readonly title: string | null
  readonly type: string
}

/** A list of StyleSheet. */
interface StyleSheetList {
  readonly length: number
  item(index: number): StyleSheet | null
  // [index: number]: StyleSheet  // Index signatures does not merge nicely.
}
