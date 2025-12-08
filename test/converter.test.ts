import { describe, it, expect } from 'vitest'
import {
  convert,
  Reference,
  Timestamp,
  Bytes,
  GeoPoint,
  FirestoreConverterValues,
} from '../src'

describe('Converter', () => {
  it('should throw error on unprocessable data type', () => {
    const obj = ({ prop: Symbol() } as unknown) as Record<
      string,
      FirestoreConverterValues
    >
    expect(() => convert(obj)).toThrowError('Unprocessable data type')
  })

  it('should convert null value', () => {
    const obj = {
      prop: null,
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        nullValue: null,
      },
    })
  })

  it('should convert boolean value', () => {
    const obj = {
      prop: true,
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        booleanValue: true,
      },
    })
  })

  it('should convert integer value', () => {
    const obj = {
      prop: 1,
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        integerValue: 1,
      },
    })
  })

  it('should convert double value', () => {
    const obj = {
      prop: 1.1,
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        doubleValue: 1.1,
      },
    })
  })

  it('should convert timestamp millis value', () => {
    const millis = 1641727129175
    const obj = {
      prop: new Timestamp(millis),
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        timestampValue: new Date(millis).toISOString(),
      },
    })
  })

  it('should convert timestamp date value', () => {
    const date = new Date()
    const obj = {
      prop: new Timestamp(date),
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        timestampValue: date.toISOString(),
      },
    })
  })

  it('should convert string value', () => {
    const obj = {
      prop: 'string',
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        stringValue: 'string',
      },
    })
  })

  it('should convert bytes value', () => {
    const bytes = new Bytes(Buffer.from('value'))
    const obj = {
      prop: bytes,
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        bytesValue: bytes.value,
      },
    })
  })

  it('should convert reference value', () => {
    const obj = {
      prop: new Reference('path/to/doc'),
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        referenceValue: 'path/to/doc',
      },
    })
  })

  it('should convert geopoint value', () => {
    const obj = {
      prop: new GeoPoint(0, 0),
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        geoPointValue: {
          latitude: 0,
          longitude: 0,
        },
      },
    })
  })

  it('should convert array value', () => {
    const obj = {
      prop: [1, 'string'],
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        arrayValue: {
          values: [{ integerValue: 1 }, { stringValue: 'string' }],
        },
      },
    })
  })

  it('should convert map value', () => {
    const obj = {
      prop: {
        prop2: 1,
        prop3: [true],
      },
    }
    const res = convert(obj)
    expect(res).toEqual({
      prop: {
        mapValue: {
          fields: {
            prop2: {
              integerValue: 1,
            },
            prop3: {
              arrayValue: {
                values: [{ booleanValue: true }],
              },
            },
          },
        },
      },
    })
  })

  describe('Edge Cases', () => {
    it('should convert empty object', () => {
      const obj = {}
      const res = convert(obj)
      expect(res).toEqual({})
    })

    it('should convert empty array', () => {
      const obj = {
        items: [],
      }
      const res = convert(obj)
      expect(res).toEqual({
        items: {
          arrayValue: {
            values: [],
          },
        },
      })
    })

    it('should convert deeply nested objects (3+ levels)', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      }
      const res = convert(obj)
      expect(res).toEqual({
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
    })

    it('should convert nested arrays', () => {
      const obj = {
        matrix: [
          [1, 2],
          [3, 4],
        ],
      }
      const res = convert(obj)
      expect(res).toEqual({
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
    })

    it('should throw error on undefined values', () => {
      const obj = { prop: undefined } as unknown as Record<
        string,
        FirestoreConverterValues
      >
      expect(() => convert(obj)).toThrowError('Unprocessable data type')
    })

    it('should throw error on function values', () => {
      const obj = { prop: () => {} } as unknown as Record<
        string,
        FirestoreConverterValues
      >
      expect(() => convert(obj)).toThrowError('Unprocessable data type')
    })

    it('should convert zero values correctly', () => {
      const obj = {
        zero: 0,
        zeroFloat: 0.0,
        emptyString: '',
        falseVal: false,
      }
      const res = convert(obj)
      expect(res).toEqual({
        zero: { integerValue: 0 },
        zeroFloat: { integerValue: 0 },
        emptyString: { stringValue: '' },
        falseVal: { booleanValue: false },
      })
    })

    it('should convert negative numbers', () => {
      const obj = {
        negInt: -42,
        negFloat: -3.14,
      }
      const res = convert(obj)
      expect(res).toEqual({
        negInt: { integerValue: -42 },
        negFloat: { doubleValue: -3.14 },
      })
    })

    it('should convert special number values', () => {
      const obj = {
        infinity: Infinity,
        negInfinity: -Infinity,
      }
      const res = convert(obj)
      expect(res).toEqual({
        infinity: { doubleValue: Infinity },
        negInfinity: { doubleValue: -Infinity },
      })
    })
  })
})
