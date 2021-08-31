import {stripIndent} from 'common-tags'
import expect from 'expect.js'
import {create, SheetsRegistry} from '../../src'
import {resetSheets, createGenerateId} from '../../../../tests/utils'

describe('Integration: sheetsRegistry', () => {
  let jss
  let sheets

  beforeEach(resetSheets())

  beforeEach(() => {
    jss = create({createGenerateId})
    sheets = new SheetsRegistry()
  })

  describe('.add()', () => {
    it('should add first sheet', () => {
      sheets.add(jss.createStyleSheet())
      expect(sheets.registry.length).to.be(1)
    })

    it('should add 2 sheets', () => {
      sheets.add(jss.createStyleSheet())
      sheets.add(jss.createStyleSheet())
      expect(sheets.registry.length).to.be(2)
    })

    it('should not add duplicates', () => {
      const sheet = jss.createStyleSheet()
      sheets.add(sheet)
      sheets.add(sheet)
      expect(sheets.registry.length).to.be(1)
    })

    it('should add 2 sheets with specific index', () => {
      const sheet0 = jss.createStyleSheet(null, {index: 1})
      const sheet1 = jss.createStyleSheet(null, {index: 0})
      sheets.add(sheet0)
      sheets.add(sheet1)
      expect(sheets.registry[0]).to.be(sheet1)
      expect(sheets.registry[1]).to.be(sheet0)
    })

    it('should add a sheet with index between 2 others', () => {
      const sheet0 = jss.createStyleSheet(null, {index: 0})
      const sheet1 = jss.createStyleSheet(null, {index: 2})
      const sheet2 = jss.createStyleSheet(null, {index: 1})
      sheets.add(sheet0)
      sheets.add(sheet1)
      sheets.add(sheet2)
      expect(sheets.registry[0]).to.be(sheet0)
      expect(sheets.registry[1]).to.be(sheet2)
      expect(sheets.registry[2]).to.be(sheet1)
    })
  })

  describe('.remove()', () => {
    it('should remove single sheet', () => {
      const sheet = jss.createStyleSheet()
      sheets.add(sheet)
      expect(sheets.registry.length).to.be(1)
      sheets.remove(sheet)
      expect(sheets.registry.length).to.be(0)
    })

    it('should remove first 2 sheets from 3', () => {
      const sheet0 = jss.createStyleSheet()
      const sheet1 = jss.createStyleSheet()
      const sheet2 = jss.createStyleSheet()
      sheets.add(sheet0)
      sheets.add(sheet1)
      sheets.add(sheet2)
      expect(sheets.registry.length).to.be(3)
      sheets.remove(sheet0)
      sheets.remove(sheet1)
      expect(sheets.registry.length).to.be(1)
      expect(sheets.registry[0]).to.be(sheet2)
    })
  })

  describe('.toString()', () => {
    it('should stringify all', () => {
      const sheet1 = jss.createStyleSheet({a: {color: 'red'}})
      const sheet2 = jss.createStyleSheet({a: {color: 'blue'}}).attach()
      sheets.add(sheet1)
      sheets.add(sheet2)
      expect(sheets.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .a-id {
          color: blue;
        }
      `)
    })

    it('should remove whitespaces', () => {
      const sheet1 = jss.createStyleSheet({a: {color: 'red'}})
      const sheet2 = jss.createStyleSheet({a: {color: 'blue'}}).attach()
      sheets.add(sheet1)
      sheets.add(sheet2)
      expect(sheets.toString({format: false})).to.be('.a-id{color:red;}.a-id{color:blue;}')
    })

    it('should stringify detached sheets', () => {
      const sheet1 = jss.createStyleSheet({a: {color: 'red'}})
      const sheet2 = jss.createStyleSheet({a: {color: 'blue'}}).attach()
      sheets.add(sheet1)
      sheets.add(sheet2)
      expect(sheets.toString({attached: false})).to.be(stripIndent`
        .a-id {
          color: red;
        }
      `)
    })

    it('should stringify attached sheets', () => {
      const sheet1 = jss.createStyleSheet({a: {color: 'red'}}).attach()
      const sheet2 = jss.createStyleSheet({a: {color: 'blue'}})
      sheets.add(sheet1)
      sheets.add(sheet2)
      expect(sheets.toString({attached: true})).to.be(stripIndent`
        .a-id {
          color: red;
        }
      `)
    })
  })
})
