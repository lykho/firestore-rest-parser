import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isArray,
  isPlainObject,
} from './type-guards'
import {
  FirestoreConverterValues,
  FirestoreResponseObjectField,
  FirestoreValueObject,
  MapConverterValue,
} from './types'
import { GeoPoint } from './data-types/geopoint'
import { Reference } from './data-types/reference'
import { Timestamp } from './data-types/timestamp'
import { Bytes } from './data-types/bytes'

/**
 * Converts a plain JavaScript object into Firestore REST API field format.
 *
 * This is the inverse of `parse()`. It takes plain values and wraps them in
 * Firestore's typed format (e.g., `"hello"` becomes `{ stringValue: "hello" }`).
 *
 * @param data - A record of field names to values. Values must be null, boolean,
 *   number, string, arrays, plain objects, or special type wrappers (Timestamp,
 *   Bytes, Reference, GeoPoint).
 * @returns Firestore REST API compatible field structure
 * @throws {Error} If an unsupported data type is encountered (e.g., Symbol, Function)
 *
 * @example
 * ```typescript
 * const fields = convert({
 *   username: 'john',
 *   age: 30,
 *   active: true,
 *   createdAt: new Timestamp(new Date()),
 *   location: new GeoPoint(40.7128, -74.0060)
 * })
 * ```
 */
export function convert(
  data: Record<string, FirestoreConverterValues>
): FirestoreResponseObjectField {
  const fields: FirestoreResponseObjectField = {}

  Object.entries(data).forEach(([name, value]) => {
    fields[name] = convertField(value, name)
  })

  return fields
}

function convertField(
  value: FirestoreConverterValues,
  path: string
): FirestoreValueObject {
  if (isNull(value)) {
    return {
      nullValue: value,
    }
  }

  if (isBoolean(value)) {
    return {
      booleanValue: value,
    }
  }

  if (isNumber(value)) {
    return Number.isInteger(value)
      ? { integerValue: value }
      : { doubleValue: value }
  }

  if (isString(value)) {
    return {
      stringValue: value,
    }
  }

  if (value instanceof Timestamp) {
    return {
      timestampValue: value.value,
    }
  }

  if (value instanceof GeoPoint) {
    return {
      geoPointValue: value.value,
    }
  }

  if (value instanceof Bytes) {
    return {
      bytesValue: value.value,
    }
  }

  if (value instanceof Reference) {
    return {
      referenceValue: value.value,
    }
  }

  if (isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item, index) => convertField(item, `${path}[${index}]`)),
      },
    }
  }

  if (isPlainObject(value)) {
    return {
      mapValue: {
        fields: convertMap(value as MapConverterValue, path),
      },
    }
  }

  throw new Error(
    `Unsupported Firestore value at "${path}": received ${describeValue(value)}`
  )
}

function convertMap(
  value: MapConverterValue,
  path: string
): FirestoreResponseObjectField {
  const fields: FirestoreResponseObjectField = {}

  Object.entries(value).forEach(([name, nestedValue]) => {
    fields[name] = convertField(nestedValue, `${path}.${name}`)
  })

  return fields
}

function describeValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (typeof value === 'function') return 'function'
  if (typeof value === 'symbol') return 'symbol'
  if (value instanceof Date) return 'Date'

  if (value && typeof value === 'object') {
    return value.constructor?.name ?? 'object'
  }

  return typeof value
}
