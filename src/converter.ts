import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isArray,
  isPlainObject,
} from 'lodash'
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

export function convert(
  data: Record<string, FirestoreConverterValues>
): FirestoreResponseObjectField {
  const fields: FirestoreResponseObjectField = {}

  Object.entries(data).forEach(([name, value]) => {
    fields[name] = convertField(value)
  })

  return fields
}

function convertField(value: FirestoreConverterValues): FirestoreValueObject {
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

export const converters: Record<FirestoreValueFieldNames, any> = {
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
