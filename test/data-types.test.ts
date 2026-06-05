import { describe, expect, it } from 'vitest'
import { Bytes, GeoPoint, Timestamp } from '../src'

describe('Data Types', () => {
  describe('Bytes', () => {
    it('should encode Uint8Array values', () => {
      const value = new Bytes(new Uint8Array([104, 101, 108, 108, 111]))

      expect(value.value).toBe('aGVsbG8=')
    })

    it('should encode ArrayBuffer values', () => {
      const value = new Bytes(new Uint8Array([1, 2, 3]).buffer)

      expect(value.value).toBe('AQID')
    })

    it('should encode single-byte values with padding', () => {
      const value = new Bytes(new Uint8Array([255]))

      expect(value.value).toBe('/w==')
    })
  })

  describe('GeoPoint', () => {
    it('should reject non-finite coordinates', () => {
      expect(() => new GeoPoint(Number.POSITIVE_INFINITY, 0)).toThrowError(
        'GeoPoint latitude and longitude must be finite numbers'
      )
    })

    it('should reject invalid latitude values', () => {
      expect(() => new GeoPoint(91, 0)).toThrowError(
        'GeoPoint latitude must be between -90 and 90'
      )
    })

    it('should reject invalid longitude values', () => {
      expect(() => new GeoPoint(0, 181)).toThrowError(
        'GeoPoint longitude must be between -180 and 180'
      )
    })
  })

  describe('Timestamp', () => {
    it('should reject invalid dates', () => {
      expect(() => new Timestamp(new Date('invalid'))).toThrowError(
        'Timestamp must be created from a valid Date or millisecond timestamp'
      )
    })

    it('should reject invalid timestamps', () => {
      expect(() => new Timestamp(Number.NaN)).toThrowError(
        'Timestamp must be created from a valid Date or millisecond timestamp'
      )
    })
  })
})
