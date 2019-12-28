import {Style} from 'jss'

export {Style}

export type StyleArg = Style | Array<Style>

export type Css = (...args: StyleArg[]) => string
