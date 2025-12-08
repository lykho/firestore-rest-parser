import { describe, it, expect } from 'vitest'
import {
  isNull,
  isBoolean,
  isNumber,
  isString,
  isArray,
  isDate,
  isPlainObject,
} from '../src/type-guards'

describe('Type Guards', () => {
  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true)
    })

    it('should return false for undefined', () => {
      expect(isNull(undefined)).toBe(false)
    })

    it('should return false for other values', () => {
      expect(isNull(0)).toBe(false)
      expect(isNull('')).toBe(false)
      expect(isNull(false)).toBe(false)
      expect(isNull({})).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('should return true for boolean primitives', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
    })

    it('should return false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false)
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean('true')).toBe(false)
      expect(isBoolean(null)).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('should return true for number primitives', () => {
      expect(isNumber(0)).toBe(true)
      expect(isNumber(42)).toBe(true)
      expect(isNumber(-1.5)).toBe(true)
      expect(isNumber(Infinity)).toBe(true)
    })

    it('should return true for NaN (it is typeof number)', () => {
      expect(isNumber(NaN)).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(isNumber('42')).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
    })
  })

  describe('isString', () => {
    it('should return true for string primitives', () => {
      expect(isString('')).toBe(true)
      expect(isString('hello')).toBe(true)
      expect(isString(`template`)).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(isString(42)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString([])).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(new Array(3))).toBe(true)
    })

    it('should return false for array-like objects', () => {
      expect(isArray({ length: 0 })).toBe(false)
      expect(isArray('string')).toBe(false)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray(null)).toBe(false)
    })
  })

  describe('isDate', () => {
    it('should return true for Date objects', () => {
      expect(isDate(new Date())).toBe(true)
      expect(isDate(new Date('2024-01-01'))).toBe(true)
    })

    it('should return true for invalid dates', () => {
      expect(isDate(new Date('invalid'))).toBe(true)
    })

    it('should return false for non-dates', () => {
      expect(isDate(Date.now())).toBe(false)
      expect(isDate('2024-01-01')).toBe(false)
      expect(isDate(null)).toBe(false)
    })
  })

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ key: 'value' })).toBe(true)
    })

    it('should return true for Object.create(null)', () => {
      expect(isPlainObject(Object.create(null))).toBe(true)
    })

    it('should return false for arrays', () => {
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject([1, 2, 3])).toBe(false)
    })

    it('should return false for class instances', () => {
      class MyClass {}
      expect(isPlainObject(new MyClass())).toBe(false)
      expect(isPlainObject(new Date())).toBe(false)
    })

    it('should return false for null', () => {
      expect(isPlainObject(null)).toBe(false)
    })

    it('should return false for primitives', () => {
      expect(isPlainObject('string')).toBe(false)
      expect(isPlainObject(42)).toBe(false)
      expect(isPlainObject(true)).toBe(false)
    })
  })
})
