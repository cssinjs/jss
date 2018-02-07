import toCssValue from '../../src/utils/toCssValue'

const singleArray = ['red']
const singleArrayImportant = ['red', '!important']
const doubleArray = [['10px', '20px']]
const doubleArrayImportant = [['10px', '20px'], '!important']
const string = '10px 20px !important'

suite('toCssValue single array', () => {
  benchmark('array', () => toCssValue(singleArray) === 'red')

  benchmark('string', () => toCssValue(string) === '10px 20px !important')
})

suite('toCssValue signle array with important', () => {
  benchmark('array', () => toCssValue(singleArrayImportant) === 'red')

  benchmark('string', () => toCssValue(string) === '10px 20px !important')
})

suite('toCssValue double array', () => {
  benchmark('array', () => toCssValue(doubleArray) === 'red')

  benchmark('string', () => toCssValue(string) === '10px 20px !important')
})

suite('toCssValue double array with important', () => {
  benchmark('array', () => toCssValue(doubleArrayImportant) === '10px 20px !important')

  benchmark('string', () => toCssValue(string) === '10px 20px !important')
})
