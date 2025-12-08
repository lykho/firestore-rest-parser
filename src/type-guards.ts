/**
 * Type guard for null values.
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * Type guard for boolean primitives.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Type guard for number primitives.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

/**
 * Type guard for string primitives.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Type guard for arrays.
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * Type guard for Date objects.
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date
}

/**
 * Type guard for plain objects (created with {} or Object.create(null)).
 * Returns false for class instances, arrays, null, and other non-plain objects.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  return proto === null || proto === Object.prototype
}
