/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {create} from '../../src'
import DomRenderer from '../../src/renderers/DomRenderer'

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
      jss = create({insertionPoint: 'jss'})
    })

    afterEach(() => {
      document.head.removeChild(comment)
    })

    it('should insert sheets before other stylesheets', () => {
      comment = document.createComment('jss')

      document.head.insertBefore(comment, document.head.querySelector('style'))

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
      document.head.insertBefore(comment, document.head.querySelectorAll('style')[1])

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

  describe('two string insertion points', () => {
    let jss1
    let jss2
    let comment1
    let comment2

    beforeEach(() => {
      jss1 = create({insertionPoint: 'jss'})
      jss2 = create({insertionPoint: 'jss2'})
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

  describe('insertion point specified but not found in the document', () => {
    let warned

    beforeEach(() => {
      warned = false
      DomRenderer.__Rewire__('warning', () => {
        warned = true
      })
    })

    afterEach(() => {
      DomRenderer.__ResetDependency__('warning')
    })

    it('should warn when string insertion point not found', () => {
      const jss = create({insertionPoint: 'something'})
      jss.createStyleSheet().attach()
      expect(warned).to.be(true)
    })

    it('should warn when element insertion point not found', () => {
      const jss = create({insertionPoint: document.createElement('div')})
      jss.createStyleSheet().attach()
      expect(warned).to.be(true)
    })
  })

  describe('element insertion point', () => {
    let insertionPoint
    beforeEach(() => {
      insertionPoint = document.body.appendChild(document.createElement('div'))
      const jss = create({insertionPoint})
      jss.createStyleSheet({}, {meta: 'sheet2', index: 2}).attach()
      jss.createStyleSheet({}, {meta: 'sheet1', index: 1}).attach()
    })

    afterEach(() => {
      document.body.removeChild(insertionPoint)
    })

    it('should insert sheets in the correct order', () => {
      const styleElements = document.body.getElementsByTagName('style')

      expect(styleElements.length).to.be(2)
      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
    })
  })

  describe('element insertion point in an iframe', () => {
    let insertionPoint
    let iframe
    let iDoc

    beforeEach(() => {
      iframe = document.createElement('iframe')
      document.body.appendChild(iframe)
      iDoc = iframe.contentWindow.document
      const body = iDoc.body || iDoc.appendChild(iDoc.createElement('body'))
      insertionPoint = body.appendChild(iDoc.createElement('div'))
      const jss = create({insertionPoint})
      jss.createStyleSheet({}, {meta: 'sheet2', index: 2}).attach()
      jss.createStyleSheet({}, {meta: 'sheet1', index: 1}).attach()
    })

    afterEach(() => {
      iframe.parentNode.removeChild(iframe)
    })

    it('should insert sheets in the correct order', () => {
      const styleElements = iDoc.getElementsByTagName('style')

      expect(styleElements.length).to.be(2)
      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
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
