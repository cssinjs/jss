import {beforeEach, describe, expect, it} from 'vitest'
import SheetsManager from '../../src/SheetsManager'

describe('Unit: SheetsManager', () => {
  describe('.add()', () => {
    let manager

    beforeEach(() => {
      manager = new SheetsManager()
    })

    it('should return valid index (1 item)', () => {
      manager.add({}, {})
      expect(manager.size).toBe(1)
    })

    it('should return valid index (2 items)', () => {
      manager.add({}, {})
      manager.add({}, {})
      expect(manager.size).toBe(2)
    })

    it('should not add a duplcate', () => {
      const key = {}
      manager.add(key, {})
      manager.add(key, {})
      expect(manager.size).toBe(1)
    })
  })

  describe('.get()', () => {
    it('should get', () => {
      const manager = new SheetsManager()
      const key1 = {}
      const sheet1 = {}
      manager.add(key1, sheet1)
      expect(manager.get(key1)).toBe(sheet1)
      const key2 = {}
      const sheet2 = {}
      manager.add(key2, sheet2)
      expect(manager.get(key2)).toBe(sheet2)
    })
  })

  describe('.manage()', () => {
    it('should call .attach()', () => {
      const manager = new SheetsManager()
      const key = {}
      let attached = 0
      const sheet = {
        attach: () => {
          attached++
        }
      }
      manager.add(key, sheet)
      manager.manage(key)
      expect(attached).toBe(1)
      manager.manage(key)
      expect(attached).toBe(1)
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
      manager.add(key, sheet)
      manager.manage(key)
      manager.manage(key)
      expect(detached).toBe(0)
      manager.unmanage(key)
      expect(detached).toBe(0)
      manager.unmanage(key)
      expect(detached).toBe(1)
      manager.unmanage(key)
      expect(detached).toBe(1)
    })
  })

  describe('.size', () => {
    it('should be 0 from the start', () => {
      const manager = new SheetsManager()
      expect(manager.size).toBe(0)
    })
    it('should be increased after addition', () => {
      const manager = new SheetsManager()
      const key = {}
      const sheet = {}
      manager.add(key, sheet)
      expect(manager.size).toBe(1)
    })
  })
})
