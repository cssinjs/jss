export default function getWhitespaceSymbols(options) {
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
