import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isArray,
  isPlainObject,
} from './type-guards'
import {
  ArrayConverterValue,
  FirestoreConverterValues,
  FirestoreResponseObjectField,
  FirestoreValueFieldNames,
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
 * });
 * ```
 */
export function convert(
  data: Record<string, FirestoreConverterValues>
): FirestoreResponseObjectField {
  const fields: FirestoreResponseObjectField = {}

  Object.entries(data).forEach(([name, value]) => {
    fields[name] = convertField(value)
  })

  return fields
}

function convertField(value: FirestoreConverterValues): Partial<FirestoreValueObject> {
  switch (true) {
    case isNull(value):
      return converters[FirestoreValueFieldNames.Null](value)
    case isBoolean(value):
      return converters[FirestoreValueFieldNames.Boolean](value)
    case isNumber(value):
      return Number.isInteger(value)
        ? converters[FirestoreValueFieldNames.Integer](value)
        : converters[FirestoreValueFieldNames.Double](value)
    case isString(value):
      return converters[FirestoreValueFieldNames.String](value)
    case value instanceof Timestamp:
      return converters[FirestoreValueFieldNames.Timestamp](value)
    case value instanceof GeoPoint:
      return converters[FirestoreValueFieldNames.GeoPoint](value)
    case value instanceof Bytes:
      return converters[FirestoreValueFieldNames.Bytes](value)
    case value instanceof Reference:
      return converters[FirestoreValueFieldNames.Reference](value)
    case isArray(value):
      return converters[FirestoreValueFieldNames.Array](value)
    case isPlainObject(value):
      return converters[FirestoreValueFieldNames.Map](value)
    default:
      throw new Error('Unprocessable data type')
  }
}

// Each converter handles a specific type, but we use a generic signature to allow
// the converters record to be typed as a lookup table
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConverterFunction = (value: any) => Partial<FirestoreValueObject>

export const converters: Record<FirestoreValueFieldNames, ConverterFunction> = {
  [FirestoreValueFieldNames.Null]: (value: null) => ({
    nullValue: value,
  }),
  [FirestoreValueFieldNames.Boolean]: (value: boolean) => ({
    booleanValue: value,
  }),
  [FirestoreValueFieldNames.Integer]: (value: number) => ({
    integerValue: value,
  }),
  [FirestoreValueFieldNames.Double]: (value: number) => ({
    doubleValue: value,
  }),
  [FirestoreValueFieldNames.Timestamp]: (timestamp: Timestamp) => ({
    timestampValue: timestamp.value,
  }),
  [FirestoreValueFieldNames.String]: (value: string) => ({
    stringValue: value,
  }),
  [FirestoreValueFieldNames.Bytes]: (bytes: Bytes) => ({
    bytesValue: bytes.value,
  }),
  [FirestoreValueFieldNames.Reference]: (reference: Reference) => ({
    referenceValue: reference.value,
  }),
  [FirestoreValueFieldNames.GeoPoint]: (geoPoint: GeoPoint) => ({
    geoPointValue: geoPoint.value,
  }),
  [FirestoreValueFieldNames.Array]: (value: ArrayConverterValue) => ({
    arrayValue: {
      values: value.map(convertField),
    },
  }),
  [FirestoreValueFieldNames.Map]: (value: MapConverterValue) => ({
    mapValue: {
      fields: convert(value),
    },
  }),
}
