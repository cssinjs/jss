import {Jss, Style} from 'jss'

export {Style}

export type StyleArg = Style | Array<Style>

export type Css = (...args: StyleArg[]) => string

type CreateCss = (jss?: Jss) => Css

declare const create: CreateCss
export {create}

declare const createCss: ReturnType<CreateCss>
export default createCss
