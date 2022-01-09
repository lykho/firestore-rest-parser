import { parse, createRESTObject } from '../src'

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
})
