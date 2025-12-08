import { isDate } from '../type-guards'

/**
 * Wrapper for Firestore Timestamp values.
 *
 * Converts JavaScript Date objects or millisecond timestamps to ISO 8601 strings
 * for use with the Firestore REST API.
 *
 * @example
 * ```typescript
 * // Using a Date object
 * const ts1 = new Timestamp(new Date());
 * console.log(ts1.value); // "2024-01-15T12:30:00.000Z"
 *
 * // Using milliseconds since epoch
 * const ts2 = new Timestamp(1705322400000);
 * console.log(ts2.value); // "2024-01-15T12:00:00.000Z"
 * ```
 */
export class Timestamp {
  constructor(private time: number | Date) {}

  /**
   * Returns the timestamp as an ISO 8601 string.
   */
  get value(): string {
    if (isDate(this.time)) {
      return this.time.toISOString()
    }
    return new Date(this.time).toISOString()
  }
}
