import expect from 'expect.js'
import SheetsManager from '../../src/SheetsManager'

describe('Unit: SheetsManager', () => {
  describe('.add()', () => {
    let manager

    beforeEach(() => {
      manager = new SheetsManager()
    })

    it('should return valid index (1 item)', () => {
      const index = manager.add({}, {})
      expect(index).to.be(0)
    })

    it('should return valid index (2 items)', () => {
      manager.add({}, {})
      const index = manager.add({}, {})
      expect(index).to.be(1)
    })

    it('should not add a duplcate', () => {
      const key = {}
      const sheet = {}
      manager.add(sheet, key)
      const index = manager.add(sheet, key)
      expect(index).to.be(0)
    })
  })

  describe('.get()', () => {
    it('should get', () => {
      const manager = new SheetsManager()
      const key1 = {}
      const sheet1 = {}
      manager.add(sheet1, key1)
      expect(manager.get(key1)).to.be(sheet1)
      const key2 = {}
      const sheet2 = {}
      manager.add(sheet2, key2)
      expect(manager.get(key2)).to.be(sheet2)
    })
  })

  describe('.manage()', () => {
    it('should add', () => {
      const manager = new SheetsManager()
      const key = {}
      const sheet = {attach: () => null}
      manager.manage(sheet, key)
      expect(manager.get(key)).to.be(sheet)
    })

    it('should call .attach()', () => {
      const manager = new SheetsManager()
      const key = {}
      let attached = 0
      const sheet = {
        attach: () => {
          attached++
        }
      }
      manager.manage(sheet, key)
      expect(attached).to.be(1)
      manager.manage(sheet, key)
      expect(attached).to.be(1)
    })
  })

  describe('.unmanage()', () => {
    it('should call .detach()', () => {
      const manager = new SheetsManager()
      const key = {}
      let detached = 0
      const sheet = {
        attach: () => null,
        detach: () => {
          detached++
        }
      }
      manager.manage(sheet, key)
      manager.manage(sheet, key)
      expect(detached).to.be(0)
      manager.unmanage(key)
      expect(detached).to.be(0)
      manager.unmanage(key)
      expect(detached).to.be(1)
      manager.unmanage(key)
      expect(detached).to.be(1)
    })
  })
})
