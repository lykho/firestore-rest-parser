import { isDate } from '../type-guards'

/**
 * Wrapper for Firestore Timestamp values.
 *
 * Converts JavaScript Date objects or millisecond timestamps to ISO 8601 strings
 * for use with the Firestore REST API.
 *
 * @example
 * ```typescript
 * const ts1 = new Timestamp(new Date())
 * console.log(ts1.value) // "2024-01-15T12:30:00.000Z"
 *
 * const ts2 = new Timestamp(1705322400000)
 * console.log(ts2.value) // "2024-01-15T12:00:00.000Z"
 * ```
 */
export class Timestamp {
  private readonly isoValue: string

  constructor(time: number | Date) {
    const date = isDate(time) ? time : new Date(time)

    if (Number.isNaN(date.getTime())) {
      throw new RangeError(
        'Timestamp must be created from a valid Date or millisecond timestamp'
      )
    }

    this.isoValue = date.toISOString()
  }

  /**
   * Returns the timestamp as an ISO 8601 string.
   */
  get value(): string {
    return this.isoValue
  }
}
