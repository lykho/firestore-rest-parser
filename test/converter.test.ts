import {
  convert,
  Reference,
  Timestamp,
  Bytes,
  GeoPoint,
  FirestoreConverterValues,
} from '../src'
import * as Buffer from 'buffer'

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
        timestampValue: 1641727129175,
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
    const bytes = new Bytes(Buffer.Buffer.from('value'))
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
})
