import { describe, it, expect } from 'vitest'
import { createRESTObject, convert } from '../src'

describe('createRESTObject', () => {
  it('should create REST object with fields', () => {
    const fields = convert({ name: 'John' })
    const result = createRESTObject(fields)

    expect(result).toEqual({
      name: '',
      fields: {
        name: { stringValue: 'John' },
      },
      createTime: '',
      updateTime: '',
    })
  })

  it('should create REST object with null fields', () => {
    const result = createRESTObject(null)

    expect(result).toEqual({
      name: '',
      fields: null,
      createTime: '',
      updateTime: '',
    })
  })

  it('should create REST object with all parameters', () => {
    const fields = convert({ active: true })
    const result = createRESTObject(
      fields,
      'projects/test/databases/(default)/documents/users/123',
      '2024-01-15T12:00:00Z',
      '2024-01-15T13:00:00Z'
    )

    expect(result).toEqual({
      name: 'projects/test/databases/(default)/documents/users/123',
      fields: {
        active: { booleanValue: true },
      },
      createTime: '2024-01-15T12:00:00Z',
      updateTime: '2024-01-15T13:00:00Z',
    })
  })

  it('should create REST object with complex fields', () => {
    const fields = convert({
      user: {
        name: 'John',
        age: 30,
      },
      tags: ['admin', 'user'],
    })
    const result = createRESTObject(fields)

    expect(result.fields).toEqual({
      user: {
        mapValue: {
          fields: {
            name: { stringValue: 'John' },
            age: { integerValue: 30 },
          },
        },
      },
      tags: {
        arrayValue: {
          values: [{ stringValue: 'admin' }, { stringValue: 'user' }],
        },
      },
    })
  })
})
