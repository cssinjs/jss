import type {ToCssOptions} from '../types'

type WhitespaceSymbols = {
  linebreak: string,
  space: string
}

export default function getWhitespaceSymbols(options?: ToCssOptions): WhitespaceSymbols {
  if (options && options.format === false) {
    return {
      linebreak: '',
      space: ''
    }
  }

  return {
    linebreak: '\n',
    space: ' '
  }
}
