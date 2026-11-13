import {bench, describe} from 'vitest'
import toCssValue from '../../src/utils/toCssValue'

const singleArray = ['red']
const singleArrayImportant = ['red', '!important']
const doubleArray = [['10px', '20px']]
const doubleArrayImportant = [['10px', '20px'], '!important']
const string = '10px 20px !important'

describe('toCssValue single array', () => {
  bench('array', () => toCssValue(singleArray) === 'red')

  bench('string', () => toCssValue(string) === '10px 20px !important')
})

describe('toCssValue signle array with important', () => {
  bench('array', () => toCssValue(singleArrayImportant) === 'red')

  bench('string', () => toCssValue(string) === '10px 20px !important')
})

describe('toCssValue double array', () => {
  bench('array', () => toCssValue(doubleArray) === 'red')

  bench('string', () => toCssValue(string) === '10px 20px !important')
})

describe('toCssValue double array with important', () => {
  bench('array', () => toCssValue(doubleArrayImportant) === '10px 20px !important')

  bench('string', () => toCssValue(string) === '10px 20px !important')
})
