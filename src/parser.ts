import {
  ArrayValue,
  FirestoreResponseObject,
  FirestoreSimpleValueNames,
  FirestoreSimpleValueObject,
  FirestoreValueFieldNames,
  FirestoreValueObject,
  GeoPointValue,
  MapValue,
} from './types'

export default function parse<T extends Record<string, any>>(
  responseObject: FirestoreResponseObject
): T {
  const { fields } = responseObject

  const parsedObject: Record<string, any> = {}

  Object.entries(fields).forEach(([name, value]) => {
    parsedObject[name] = parseField(value as FirestoreValueObject)
  })

  return parsedObject as T
}

function parseField(value: FirestoreValueObject) {
  const fieldName = getFieldName(value)
  const parser = parsers[fieldName]
  return parser(value)
}

function getFieldName(value: FirestoreValueObject): FirestoreValueFieldNames {
  let fieldName: FirestoreValueFieldNames
  for (const name of Object.values(FirestoreValueFieldNames)) {
    if (typeof value[name] !== 'undefined') {
      fieldName = name
      break
    }
  }
  return fieldName!
}

const createSimpleParser = (fieldName: FirestoreSimpleValueNames) => (
  value: FirestoreSimpleValueObject
) => value[fieldName]

const geoPointParser = (
  value: Record<FirestoreValueFieldNames.GeoPoint, GeoPointValue>
) => ({
  latitude: value[FirestoreValueFieldNames.GeoPoint].latitude,
  longitude: value[FirestoreValueFieldNames.GeoPoint].longitude,
})

const arrayParser = (
  value: Record<FirestoreValueFieldNames.Array, ArrayValue>
) =>
  value[FirestoreValueFieldNames.Array].values.map(value =>
    parseField(value as FirestoreValueObject)
  )

const mapParser = (value: Record<FirestoreValueFieldNames.Map, MapValue>) => {
  const parsedObject: Record<string, any> = {}
  Object.entries(value[FirestoreValueFieldNames.Map].fields).forEach(
    ([name, value]) => {
      parsedObject[name] = parseField(value as FirestoreValueObject)
    }
  )
  return parsedObject
}

const parsers: Record<FirestoreValueFieldNames, any> = {
  [FirestoreValueFieldNames.Null]: createSimpleParser(
    FirestoreValueFieldNames.Null
  ),
  [FirestoreValueFieldNames.Boolean]: createSimpleParser(
    FirestoreValueFieldNames.Boolean
  ),
  [FirestoreValueFieldNames.Integer]: createSimpleParser(
    FirestoreValueFieldNames.Integer
  ),
  [FirestoreValueFieldNames.Double]: createSimpleParser(
    FirestoreValueFieldNames.Double
  ),
  [FirestoreValueFieldNames.Timestamp]: createSimpleParser(
    FirestoreValueFieldNames.Timestamp
  ),
  [FirestoreValueFieldNames.String]: createSimpleParser(
    FirestoreValueFieldNames.String
  ),
  [FirestoreValueFieldNames.Bytes]: createSimpleParser(
    FirestoreValueFieldNames.Bytes
  ),
  [FirestoreValueFieldNames.Reference]: createSimpleParser(
    FirestoreValueFieldNames.Reference
  ),
  [FirestoreValueFieldNames.GeoPoint]: geoPointParser,
  [FirestoreValueFieldNames.Array]: arrayParser,
  [FirestoreValueFieldNames.Map]: mapParser,
}
