// @flow

export type ClassName = string

export type Style = {} | null | void | '' | ClassName

export type StyleArg = Style | Array<Style>

export type Css = (...args: StyleArg[]) => string
