import { GeoPoint } from './data-types/geopoint'
import { Reference } from './data-types/reference'
import { Timestamp } from './data-types/timestamp'
import { Bytes } from './data-types/bytes'

export enum FirestoreValueFieldNames {
  Null = 'nullValue',
  Boolean = 'booleanValue',
  Integer = 'integerValue',
  Double = 'doubleValue',
  Timestamp = 'timestampValue',
  String = 'stringValue',
  Bytes = 'bytesValue', // base64 encoded string
  Reference = 'referenceValue', // A reference to a document, e.g. projects/{project_id}/documents/{document_path}
  GeoPoint = 'geoPointValue',
  Array = 'arrayValue',
  Map = 'mapValue',
}

export type NullValue = null

export type BooleanValue = boolean

export type IntegerValue = string

export type DoubleValue = number

export type TimestampValue = string

export type StringValue = string

export type BytesValue = string

export type ReferenceValue = string

export type GeoPointValue = {
  latitude: number
  longitude: number
}

export type ArrayValue = {
  values: Partial<FirestoreValueObject>[]
}

export type MapValue = {
  fields: Record<string, Partial<FirestoreValueObject>>
}

export type FirestoreValues =
  | NullValue
  | BooleanValue
  | IntegerValue
  | DoubleValue
  | TimestampValue
  | StringValue
  | BytesValue
  | ReferenceValue
  | GeoPointValue
  | ArrayValue
  | MapValue

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

export type FirestoreValueObject = {
  [key in FirestoreValueFieldNames]: FirestoreValues
}

export type FirestoreSimpleValueNames = Exclude<
  FirestoreValueFieldNames,
  | FirestoreValueFieldNames.Map
  | FirestoreValueFieldNames.Array
  | FirestoreValueFieldNames.GeoPoint
>

export type FirestoreSimpleValues = Exclude<
  FirestoreValues,
  MapValue | ArrayValue | GeoPointValue
>

export type FirestoreSimpleValueObject = {
  [key in FirestoreSimpleValueNames]: FirestoreSimpleValues
}

export type FirestoreResponseObjectField = Record<
  string,
  Partial<FirestoreValueObject>
>

export interface FirestoreResponseObject {
  name: string
  fields: FirestoreResponseObjectField | null
  createTime: string
  updateTime: string
}
