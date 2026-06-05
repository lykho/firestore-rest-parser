import {
  ArrayValue,
  FirestoreResponseObject,
  FirestoreValueFieldNames,
  FirestoreValueObject,
  GeoPointValue,
  IntegerMode,
  MapValue,
  ParseOptions,
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
 * @param options - Parsing options such as integer handling mode
 * @returns The parsed document fields as a plain object, or `null` if the
 *   document has no fields
 *
 * @example
 * ```typescript
 * interface User {
 *   name: string
 *   age: number
 * }
 *
 * const response = await fetch('https://firestore.googleapis.com/...')
 * const doc = await response.json()
 * const user = parse<User>(doc)
 * ```
 */
export function parse<T = Record<string, ParsedValue>>(
  responseObject: FirestoreResponseObject | null | undefined,
  options: ParseOptions = {}
): T | null {
  if (!responseObject || !responseObject.fields) return null

  const normalizedOptions = normalizeParseOptions(options)
  const parsedObject: Record<string, ParsedValue> = {}

  Object.entries(responseObject.fields).forEach(([name, value]) => {
    parsedObject[name] = parseField(value, name, normalizedOptions)
  })

  return parsedObject as T
}

function normalizeParseOptions(options: ParseOptions): Required<ParseOptions> {
  return {
    integerMode: options.integerMode ?? 'smart',
  }
}

function parseField(
  value: FirestoreValueObject,
  path: string,
  options: Required<ParseOptions>
): ParsedValue {
  const fieldName = getFieldName(value, path)

  switch (fieldName) {
    case FirestoreValueFieldNames.Null:
      return (value as { nullValue: null }).nullValue
    case FirestoreValueFieldNames.Boolean:
      return (value as { booleanValue: boolean }).booleanValue
    case FirestoreValueFieldNames.Integer:
      return parseInteger(
        (value as { integerValue: string | number }).integerValue,
        path,
        options.integerMode
      )
    case FirestoreValueFieldNames.Double:
      return (value as { doubleValue: number }).doubleValue
    case FirestoreValueFieldNames.Timestamp:
      return (value as { timestampValue: string }).timestampValue
    case FirestoreValueFieldNames.String:
      return (value as { stringValue: string }).stringValue
    case FirestoreValueFieldNames.Bytes:
      return (value as { bytesValue: string }).bytesValue
    case FirestoreValueFieldNames.Reference:
      return (value as { referenceValue: string }).referenceValue
    case FirestoreValueFieldNames.GeoPoint:
      return parseGeoPoint((value as { geoPointValue: GeoPointValue }).geoPointValue, path)
    case FirestoreValueFieldNames.Array:
      return parseArray((value as { arrayValue: ArrayValue }).arrayValue, path, options)
    case FirestoreValueFieldNames.Map:
      return parseMap((value as { mapValue: MapValue }).mapValue, path, options)
  }

  return assertNever(fieldName, path)
}

function getFieldName(
  value: FirestoreValueObject,
  path: string
): FirestoreValueFieldNames {
  const fieldNames = Object.values(FirestoreValueFieldNames).filter(
    name =>
      typeof (value as Partial<Record<FirestoreValueFieldNames, unknown>>)[name] !==
      'undefined'
  )

  if (fieldNames.length === 0) {
    throw new Error(
      `Invalid Firestore value at "${path}": expected exactly one Firestore value key, received none`
    )
  }

  if (fieldNames.length > 1) {
    throw new Error(
      `Invalid Firestore value at "${path}": expected exactly one Firestore value key, received ${fieldNames.join(', ')}`
    )
  }

  return fieldNames[0]
}

function parseInteger(
  raw: string | number,
  path: string,
  integerMode: IntegerMode
): ParsedValue {
  if (typeof raw === 'number') {
    if (!Number.isInteger(raw)) {
      throw new Error(
        `Invalid Firestore integer at "${path}": expected an integer, received ${raw}`
      )
    }

    switch (integerMode) {
      case 'number':
        return raw
      case 'string':
        return String(raw)
      case 'bigint':
        return BigInt(raw)
      case 'smart':
        return Number.isSafeInteger(raw) ? raw : String(raw)
    }
  }

  if (!/^-?\d+$/.test(raw)) {
    throw new Error(
      `Invalid Firestore integer at "${path}": expected an integer string, received "${raw}"`
    )
  }

  switch (integerMode) {
    case 'number':
      return Number(raw)
    case 'string':
      return raw
    case 'bigint':
      return BigInt(raw)
    case 'smart': {
      const parsed = Number(raw)
      return Number.isSafeInteger(parsed) ? parsed : raw
    }
  }

  return assertNever(integerMode, path)
}

function parseGeoPoint(value: GeoPointValue, path: string): GeoPointValue {
  if (!isRecord(value)) {
    throw new Error(
      `Invalid Firestore geopoint at "${path}": expected an object with latitude and longitude`
    )
  }

  const { latitude, longitude } = value

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error(
      `Invalid Firestore geopoint at "${path}": latitude and longitude must be numbers`
    )
  }

  return {
    latitude,
    longitude,
  }
}

function parseArray(
  value: ArrayValue,
  path: string,
  options: Required<ParseOptions>
): ParsedValue[] {
  if (!isRecord(value)) {
    throw new Error(
      `Invalid Firestore array at "${path}": expected an object with an optional values array`
    )
  }

  const values = value.values ?? []

  if (!Array.isArray(values)) {
    throw new Error(
      `Invalid Firestore array at "${path}": values must be an array when provided`
    )
  }

  return values.map((item, index) =>
    parseField(item, `${path}[${index}]`, options)
  )
}

function parseMap(
  value: MapValue,
  path: string,
  options: Required<ParseOptions>
): Record<string, ParsedValue> {
  if (!isRecord(value) || !isRecord(value.fields)) {
    throw new Error(
      `Invalid Firestore map at "${path}": expected a fields object`
    )
  }

  const parsedObject: Record<string, ParsedValue> = {}

  Object.entries(value.fields).forEach(([name, fieldValue]) => {
    parsedObject[name] = parseField(
      fieldValue as FirestoreValueObject,
      `${path}.${name}`,
      options
    )
  })

  return parsedObject
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

function assertNever(value: never, path: string): never {
  throw new Error(`Unsupported Firestore value at "${path}": ${String(value)}`)
}
