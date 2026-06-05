const base64Alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/**
 * Wrapper for Firestore Bytes values.
 *
 * Converts binary data to a base64-encoded string for use with the Firestore
 * REST API.
 *
 * @example
 * ```typescript
 * const data = new Bytes(new Uint8Array([104, 101, 108, 108, 111]))
 * convert({ binaryData: data })
 * // => { binaryData: { bytesValue: "aGVsbG8=" } }
 * ```
 */
export class Bytes {
  private readonly bytes: Uint8Array

  constructor(bytes: Uint8Array | ArrayBuffer) {
    this.bytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  }

  /**
   * Returns the binary data as a base64-encoded string.
   */
  get value(): string {
    return encodeBase64(this.bytes)
  }
}

function encodeBase64(bytes: Uint8Array): string {
  let encoded = ''

  for (let index = 0; index < bytes.length; index += 3) {
    const byte1 = bytes[index]
    const hasByte2 = index + 1 < bytes.length
    const hasByte3 = index + 2 < bytes.length
    const byte2 = hasByte2 ? bytes[index + 1] : 0
    const byte3 = hasByte3 ? bytes[index + 2] : 0
    const triplet = (byte1 << 16) | (byte2 << 8) | byte3

    encoded += base64Alphabet[(triplet >> 18) & 0x3f]
    encoded += base64Alphabet[(triplet >> 12) & 0x3f]
    encoded += hasByte2 ? base64Alphabet[(triplet >> 6) & 0x3f] : '='
    encoded += hasByte3 ? base64Alphabet[triplet & 0x3f] : '='
  }

  return encoded
}
