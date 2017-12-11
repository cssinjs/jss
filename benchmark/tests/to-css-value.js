import toCssValue from '../../src/utils/toCssValue'

const singleArray = ['red']
const singleArrayImportant = ['red', '!important']
const doubleArray = [['10px', '20px']]
const doubleArrayImportant = [['10px', '20px'], '!important']
const string = '10px 20px !important'

suite.only('toCssValue', () => {
  benchmark('singleArray', () => {
    toCssValue(singleArray) === 'red'
  })

  benchmark('singleArrayImportant', () => {
    toCssValue(singleArrayImportant) === 'red !important'
  })

  benchmark('doubleArray', () => {
    toCssValue(doubleArray) === '10px 20px'
  })

  benchmark('doubleArrayImportant', () => {
    toCssValue(doubleArrayImportant) === '10px 20px !important'
  })

  benchmark('string', () => {
    toCssValue(string) === '10px 20px !important'
  })
})
