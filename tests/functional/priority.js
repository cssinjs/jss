import expect from 'expect.js'
import {create} from '../../src'

describe('Functional: dom priority', () => {
  function createDummySheets() {
    for (let i = 0; i < 2; i++) {
      const dummySheet = document.createElement('style')
      dummySheet.type = 'text/css'
      dummySheet.setAttribute('data-test-dummy', `dummy${i + 1}`)
      dummySheet.setAttribute('data-jss', `dummy${i + 1}`)
      document.head.appendChild(dummySheet)
    }
  }

  describe('without insertion point', () => {
    let jss

    beforeEach(() => {
      createDummySheets()
      jss = create()
    })

    it('should append sheets to the end of the document head after other stylesheets', () => {
      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 1}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 75}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 35}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(7)

      expect(styleElements[0].getAttribute('data-test-dummy')).to.be('dummy1')
      expect(styleElements[1].getAttribute('data-test-dummy')).to.be('dummy2')

      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[5].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[6].getAttribute('data-meta')).to.be('sheet4')
    })
  })

  describe('with an insertion point', () => {
    let jss
    let comment

    beforeEach(() => {
      createDummySheets()
      jss = create()
    })

    afterEach(() => {
      document.head.removeChild(comment)
    })

    it('should insert sheets before other stylesheets', () => {
      comment = document.createComment('jss')

      document.head.insertBefore(
        comment,
        document.head.querySelector('style')
      )

      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 1}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 75}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 35}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(7)

      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet4')
      expect(styleElements[5].getAttribute('data-test-dummy')).to.be('dummy1')
      expect(styleElements[6].getAttribute('data-test-dummy')).to.be('dummy2')
    })

    it('should insert sheets after other stylesheets', () => {
      comment = document.createComment('jss')
      document.head.appendChild(comment)

      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 1}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 75}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 35}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(7)

      expect(styleElements[0].getAttribute('data-test-dummy')).to.be('dummy1')
      expect(styleElements[1].getAttribute('data-test-dummy')).to.be('dummy2')

      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[5].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[6].getAttribute('data-meta')).to.be('sheet4')
    })

    it('should insert sheets between other stylesheets', () => {
      comment = document.createComment('jss')
      document.head.insertBefore(
        comment,
        document.head.querySelectorAll('style')[1]
      )

      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 1}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 75}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 35}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(7)

      expect(styleElements[0].getAttribute('data-test-dummy')).to.be('dummy1')

      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[5].getAttribute('data-meta')).to.be('sheet4')

      expect(styleElements[6].getAttribute('data-test-dummy')).to.be('dummy2')
    })
  })

  describe('custom string insertion point', () => {
    let jss1
    let jss2
    let comment1
    let comment2

    beforeEach(() => {
      jss1 = create()
      jss2 = create({
        insertionPoint: 'jss2'
      })
      comment1 = document.head.appendChild(document.createComment('jss'))
      comment2 = document.head.appendChild(document.createComment('jss2'))
    })

    afterEach(() => {
      document.head.removeChild(comment1)
      document.head.removeChild(comment2)
    })

    it('should insert sheets in the correct order', () => {
      jss2.createStyleSheet({}, {meta: 'sheet2'}).attach()
      jss1.createStyleSheet({}, {meta: 'sheet1'}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(2)
      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
    })
  })

  describe('custom element insertion point', () => {
    let div
    let jss

    beforeEach(() => {
      div = document.body.appendChild(document.createElement('div'))
      jss = create({insertionPoint: div})
    })

    afterEach(() => {
      document.body.removeChild(div)
    })

    it('should insert sheets in the correct order', () => {
      jss.createStyleSheet().attach()
      const styleElements = document.body.getElementsByTagName('style')
      expect(styleElements.length).to.be(1)
    })
  })

  describe('preserve attachment order with no index, but with registry', () => {
    let jss

    beforeEach(() => {
      jss = create()
    })

    it('should insert sheets in the correct order', () => {
      jss.createStyleSheet({}, {meta: 'sheet0'}).attach()
      jss.createStyleSheet({}, {meta: 'sheet1'}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(2)

      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet0')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet1')
    })
  })

  describe('preserve attachment order with no index and no registry', () => {
    let jss

    beforeEach(() => {
      jss = create()
    })

    it('should insert sheets in the correct order', () => {
      jss.createStyleSheet({}, {meta: 'sheet0'}).attach()
      jss.createStyleSheet({}, {meta: 'sheet1'}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(2)

      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet0')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet1')
    })
  })

  describe('with zero and negative indices', () => {
    let jss

    beforeEach(() => {
      jss = create()
    })

    it('should insert sheets in the correct order', () => {
      jss.createStyleSheet({}, {meta: 'sheet1', index: 0}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: -5}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: -999}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 3}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 312}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(5)

      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet4')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet5')
    })
  })

  describe('with multiple sheets using the same index', () => {
    let jss

    beforeEach(() => {
      jss = create()
    })

    it('should insert sheets with the same index after existing', () => {
      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 20}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 40}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(5)

      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet4')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet1')
    })
  })
})
