import expect from 'expect.js'
import {getSheetOptions} from './sheets'
import defaultJss from '../jss'

const generateId = rule => rule.key

describe('react-jss: get-sheet-options', () => {
  it('should use context generateId', () => {
    const sheetOptions = getSheetOptions({
      sheetOptions: {},
      context: {
        generateId: defaultJss.generateId
      }
    })

    expect(sheetOptions.generateId).to.eql(defaultJss.generateId)
  })

  it('should apply generateId correctly', () => {
    const options = {
      sheetOptions: {generateId},
      context: {}
    }

    const sheetOptions = getSheetOptions(options)

    expect(sheetOptions.generateId).to.eql(generateId)
  })
})
