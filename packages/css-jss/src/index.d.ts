import {Jss, JssStyle} from 'jss'

export {JssStyle}

export type StyleArg = JssStyle | Array<JssStyle>

export type Css = (...args: StyleArg[]) => string

type CreateCss = (jss?: Jss) => Css

declare const create: CreateCss
export {create}

declare const createCss: ReturnType<CreateCss>
export default createCss
