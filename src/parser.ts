import {
  ArrayValue,
  FirestoreResponseObject,
  FirestoreSimpleValueNames,
  FirestoreSimpleValueObject,
  FirestoreValueFieldNames,
  FirestoreValueObject,
  GeoPointValue,
  MapValue,
  ParsedValue,
} from './types'

/**
 * Parses a Firestore REST API response object into a plain JavaScript object.
 *
 * This function recursively converts Firestore's typed value format (e.g.,
 * `{ stringValue: "hello" }`) into plain values (`"hello"`).
 *
 * @typeParam T - The expected shape of the parsed result. This is a compile-time
 *   assertion only and is NOT validated at runtime.
 * @param responseObject - A Firestore document response containing `name`,
 *   `fields`, `createTime`, and `updateTime`
 * @returns The parsed document fields as a plain object, or `null` if the
 *   document has no fields
 *
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   age: number;
 * }
 *
 * const response = await fetch('https://firestore.googleapis.com/...');
 * const doc = await response.json();
 * const user = parse<User>(doc);
 * ```
 */
export function parse<T = Record<string, ParsedValue>>(
  responseObject: FirestoreResponseObject
): T | null {
  if (!responseObject || !responseObject.fields) return null

  const { fields } = responseObject

  const parsedObject: Record<string, ParsedValue> = {}

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

const integerParser = (
  value: Record<FirestoreValueFieldNames.Integer, string | number>
) => {
  const raw = value[FirestoreValueFieldNames.Integer]
  return typeof raw === 'string' ? Number(raw) : raw
}

const geoPointParser = (
  value: Record<FirestoreValueFieldNames.GeoPoint, GeoPointValue>
) => ({
  latitude: value[FirestoreValueFieldNames.GeoPoint].latitude,
  longitude: value[FirestoreValueFieldNames.GeoPoint].longitude,
})

const arrayParser = (
  value: Record<FirestoreValueFieldNames.Array, ArrayValue>
): ParsedValue[] =>
  (value[FirestoreValueFieldNames.Array].values ?? []).map(value =>
    parseField(value as FirestoreValueObject)
  )

const mapParser = (value: Record<FirestoreValueFieldNames.Map, MapValue>): Record<string, ParsedValue> => {
  const parsedObject: Record<string, ParsedValue> = {}
  Object.entries(value[FirestoreValueFieldNames.Map].fields).forEach(
    ([name, value]) => {
      parsedObject[name] = parseField(value as FirestoreValueObject)
    }
  )
  return parsedObject
}

// Each parser handles a specific Firestore value type, but we use a generic signature
// to allow the parsers record to be typed as a lookup table
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParserFunction = (value: any) => ParsedValue

const parsers: Record<FirestoreValueFieldNames, ParserFunction> = {
  [FirestoreValueFieldNames.Null]: createSimpleParser(
    FirestoreValueFieldNames.Null
  ),
  [FirestoreValueFieldNames.Boolean]: createSimpleParser(
    FirestoreValueFieldNames.Boolean
  ),
  [FirestoreValueFieldNames.Integer]: integerParser,
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
