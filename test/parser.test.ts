import { describe, it, expect } from 'vitest'
import {
  FirestoreResponseObject,
  FirestoreValueObject,
  IntegerMode,
  parse,
  createRESTObject,
} from '../src'

describe('Parser', () => {
  it('should parse nullValue', () => {
    const obj = createRESTObject({
      field: {
        nullValue: null,
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: null })
  })

  it('should parse boolean value', () => {
    const obj = createRESTObject({
      field: {
        booleanValue: true,
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: true })
  })

  it('should parse integer value', () => {
    const obj = createRESTObject({
      field: {
        integerValue: 101,
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: 101 })
  })

  it('should parse integer value from string', () => {
    const obj = createRESTObject({
      field: {
        integerValue: '101',
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: 101 })
  })

  it('should parse double value', () => {
    const obj = createRESTObject({
      field: {
        doubleValue: 10.1,
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: 10.1 })
  })

  it('should parse timestamp value', () => {
    const obj = createRESTObject({
      field: {
        timestampValue: '2014-10-02T15:01:23Z',
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: '2014-10-02T15:01:23Z' })
  })

  it('should parse string value', () => {
    const obj = createRESTObject({
      field: {
        stringValue: 'Howdy',
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: 'Howdy' })
  })

  it('should parse bytes value', () => {
    const bytes = Buffer.from('buuuufer').toString('base64')
    const obj = createRESTObject({
      field: {
        bytesValue: bytes,
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: bytes })
  })

  it('should parse reference value', () => {
    const obj = createRESTObject({
      field: {
        referenceValue: 'You shall not pass!',
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: 'You shall not pass!' })
  })

  it('should parse geopoint value', () => {
    const obj = createRESTObject({
      field: {
        geoPointValue: {
          latitude: 0,
          longitude: 0,
        },
      },
    })
    const res = parse(obj)
    expect(res).toEqual({
      field: {
        latitude: 0,
        longitude: 0,
      },
    })
  })

  it('should parse array value', () => {
    const obj = createRESTObject({
      field: {
        arrayValue: {
          values: [{ stringValue: 'Hellow' }],
        },
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: ['Hellow'] })
  })

  it('should parse object value', () => {
    const obj = createRESTObject({
      field: {
        mapValue: {
          fields: {
            world: {
              stringValue: 'hi',
            },
          },
        },
      },
    })
    const res = parse(obj)
    expect(res).toEqual({ field: { world: 'hi' } })
  })

  describe('Edge Cases', () => {
    it('should return null for null input', () => {
      const res = parse(null as unknown as FirestoreResponseObject)
      expect(res).toBeNull()
    })

    it('should return null for document with null fields', () => {
      const obj = createRESTObject(null)
      const res = parse(obj)
      expect(res).toBeNull()
    })

    it('should parse empty arrays', () => {
      const obj = createRESTObject({
        field: {
          arrayValue: {},
        },
      })
      const res = parse(obj)
      expect(res).toEqual({ field: [] })
    })

    it('should parse deeply nested objects (3+ levels)', () => {
      const obj = createRESTObject({
        level1: {
          mapValue: {
            fields: {
              level2: {
                mapValue: {
                  fields: {
                    level3: {
                      mapValue: {
                        fields: {
                          value: {
                            stringValue: 'deep',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
      const res = parse(obj)
      expect(res).toEqual({
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      })
    })

    it('should parse arrays with mixed types', () => {
      const obj = createRESTObject({
        mixed: {
          arrayValue: {
            values: [
              { stringValue: 'text' },
              { integerValue: 42 },
              { booleanValue: true },
              { nullValue: null },
            ],
          },
        },
      })
      const res = parse(obj)
      expect(res).toEqual({
        mixed: ['text', 42, true, null],
      })
    })

    it('should parse nested arrays', () => {
      const obj = createRESTObject({
        matrix: {
          arrayValue: {
            values: [
              {
                arrayValue: {
                  values: [{ integerValue: 1 }, { integerValue: 2 }],
                },
              },
              {
                arrayValue: {
                  values: [{ integerValue: 3 }, { integerValue: 4 }],
                },
              },
            ],
          },
        },
      })
      const res = parse(obj)
      expect(res).toEqual({
        matrix: [
          [1, 2],
          [3, 4],
        ],
      })
    })

    it('should parse with TypeScript generic type hint', () => {
      interface User {
        name: string
        age: number
      }
      const obj = createRESTObject({
        name: { stringValue: 'John' },
        age: { integerValue: 30 },
      })
      const res = parse<User>(obj)
      expect(res?.name).toBe('John')
      expect(res?.age).toBe(30)
    })

    it('should preserve unsafe integers as strings by default', () => {
      const obj = createRESTObject({
        field: {
          integerValue: '9007199254740993',
        },
      })

      const res = parse(obj)
      expect(res).toEqual({ field: '9007199254740993' })
    })

    it('should parse integers as bigint when requested', () => {
      const obj = createRESTObject({
        field: {
          integerValue: '9007199254740993',
        },
      })

      const res = parse(obj, { integerMode: 'bigint' })
      expect(res).toEqual({ field: BigInt('9007199254740993') })
    })

    it('should parse numeric integers as strings when requested', () => {
      const obj = createRESTObject({
        field: {
          integerValue: 42,
        },
      })

      const res = parse(obj, { integerMode: 'string' })
      expect(res).toEqual({ field: '42' })
    })

    it('should parse numeric integers as bigint when requested', () => {
      const obj = createRESTObject({
        field: {
          integerValue: 42,
        },
      })

      const res = parse(obj, { integerMode: 'bigint' })
      expect(res).toEqual({ field: BigInt(42) })
    })

    it('should parse integers as numbers when requested', () => {
      const obj = createRESTObject({
        field: {
          integerValue: '42',
        },
      })

      const res = parse(obj, { integerMode: 'number' })
      expect(res).toEqual({ field: 42 })
    })

    it('should throw for invalid integer strings', () => {
      const obj = createRESTObject({
        field: {
          integerValue: '42.5',
        } as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore integer at "field": expected an integer string, received "42.5"'
      )
    })

    it('should throw for non-integer numeric values', () => {
      const obj = createRESTObject({
        field: {
          integerValue: 42.5,
        } as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore integer at "field": expected an integer, received 42.5'
      )
    })

    it('should throw for multiple Firestore value keys in one field', () => {
      const obj = createRESTObject({
        field: {
          integerValue: 1,
          stringValue: 'bad',
        } as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore value at "field": expected exactly one Firestore value key, received integerValue, stringValue'
      )
    })

    it('should throw when a field has no Firestore value key', () => {
      const obj = createRESTObject({
        field: {} as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore value at "field": expected exactly one Firestore value key, received none'
      )
    })

    it('should throw for malformed map values', () => {
      const obj = createRESTObject({
        profile: {
          mapValue: {} as unknown as FirestoreValueObject,
        } as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore map at "profile": expected a fields object'
      )
    })

    it('should throw for malformed arrays', () => {
      const obj = createRESTObject({
        tags: {
          arrayValue: {
            values: 'bad',
          } as unknown as FirestoreValueObject,
        } as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore array at "tags": values must be an array when provided'
      )
    })

    it('should throw when arrayValue is not an object', () => {
      const obj = createRESTObject({
        tags: {
          arrayValue: null as unknown as FirestoreValueObject,
        } as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore array at "tags": expected an object with an optional values array'
      )
    })

    it('should throw for malformed geopoints', () => {
      const obj = createRESTObject({
        location: {
          geoPointValue: {
            latitude: '0',
            longitude: 0,
          } as unknown as FirestoreValueObject,
        } as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore geopoint at "location": latitude and longitude must be numbers'
      )
    })

    it('should throw when geoPointValue is not an object', () => {
      const obj = createRESTObject({
        location: {
          geoPointValue: null as unknown as FirestoreValueObject,
        } as unknown as FirestoreValueObject,
      })

      expect(() => parse(obj)).toThrowError(
        'Invalid Firestore geopoint at "location": expected an object with latitude and longitude'
      )
    })

    it('should throw for unsupported integer modes', () => {
      const obj = createRESTObject({
        field: {
          integerValue: '42',
        },
      })

      expect(() =>
        parse(obj, { integerMode: 'mystery' as unknown as IntegerMode })
      ).toThrowError('Unsupported Firestore value at "field": mystery')
    })
  })
})
