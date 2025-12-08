/**
 * Wrapper for Firestore Bytes values.
 *
 * Converts a Node.js Buffer to a base64-encoded string for use with the
 * Firestore REST API.
 *
 * @example
 * ```typescript
 * const data = new Bytes(Buffer.from('hello world'));
 * convert({ binaryData: data });
 * // => { binaryData: { bytesValue: "aGVsbG8gd29ybGQ=" } }
 * ```
 */
export class Bytes {
  constructor(private buffer: Buffer) {}

  /**
   * Returns the buffer as a base64-encoded string.
   */
  get value(): string {
    return this.buffer.toString('base64')
  }
}
