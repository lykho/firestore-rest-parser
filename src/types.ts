import { GeoPoint } from './data-types/geopoint'
import { Reference } from './data-types/reference'
import { Timestamp } from './data-types/timestamp'
import { Bytes } from './data-types/bytes'

export type ParsedIntegerValue = number | string | bigint

/**
 * Union type representing all possible values that can be returned from parsing
 * a Firestore document.
 */
export type ParsedValue =
  | null
  | boolean
  | string
  | number
  | bigint
  | GeoPointValue
  | ParsedValue[]
  | { [key: string]: ParsedValue }

/**
 * Enum of Firestore REST API field type names.
 */
export enum FirestoreValueFieldNames {
  Null = 'nullValue',
  Boolean = 'booleanValue',
  Integer = 'integerValue',
  Double = 'doubleValue',
  Timestamp = 'timestampValue',
  String = 'stringValue',
  Bytes = 'bytesValue',
  Reference = 'referenceValue',
  GeoPoint = 'geoPointValue',
  Array = 'arrayValue',
  Map = 'mapValue',
}

export type NullValue = null

export type BooleanValue = boolean

export type IntegerValue = string | number

export type DoubleValue = number

export type TimestampValue = string

export type StringValue = string

export type BytesValue = string

export type ReferenceValue = string

export type GeoPointValue = {
  latitude: number
  longitude: number
}

export type FirestoreSimpleValues =
  | NullValue
  | BooleanValue
  | IntegerValue
  | DoubleValue
  | TimestampValue
  | StringValue
  | BytesValue
  | ReferenceValue

export type FirestoreSimpleValueObject =
  | { nullValue: NullValue }
  | { booleanValue: BooleanValue }
  | { integerValue: IntegerValue }
  | { doubleValue: DoubleValue }
  | { timestampValue: TimestampValue }
  | { stringValue: StringValue }
  | { bytesValue: BytesValue }
  | { referenceValue: ReferenceValue }

export type FirestoreValueObject =
  | FirestoreSimpleValueObject
  | { geoPointValue: GeoPointValue }
  | { arrayValue: ArrayValue }
  | { mapValue: MapValue }

export type ArrayValue = {
  values?: FirestoreValueObject[]
}

export type MapValue = {
  fields: Record<string, FirestoreValueObject>
}

export type FirestoreConverterValues =
  | NullValue
  | BooleanValue
  | IntegerValue
  | DoubleValue
  | StringValue
  | Timestamp
  | Bytes
  | GeoPoint
  | Reference
  | ArrayConverterValue
  | MapConverterValue

export type ArrayConverterValue = Array<FirestoreConverterValues>

export interface MapConverterValue {
  [key: string]: FirestoreConverterValues
}

export type FirestoreSimpleValueNames = Exclude<
  FirestoreValueFieldNames,
  | FirestoreValueFieldNames.Map
  | FirestoreValueFieldNames.Array
  | FirestoreValueFieldNames.GeoPoint
>

export type IntegerMode = 'number' | 'string' | 'bigint' | 'smart'

export interface ParseOptions {
  integerMode?: IntegerMode
}

export type FirestoreResponseObjectField = Record<string, FirestoreValueObject>

export interface FirestoreResponseObject {
  name: string
  fields: FirestoreResponseObjectField | null
  createTime: string
  updateTime: string
}
