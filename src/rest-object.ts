import { FirestoreResponseObject, FirestoreResponseObjectField } from './types'

/**
 * Creates a complete Firestore REST API document structure.
 *
 * Use this to wrap converted fields into the full document format expected
 * by Firestore write operations.
 *
 * @param fields - The document fields, typically from `convert()`. Pass `null`
 *   for documents with no fields.
 * @param name - The document resource name (e.g., "projects/my-project/databases/(default)/documents/users/user123")
 * @param createTime - ISO 8601 timestamp when the document was created
 * @param updateTime - ISO 8601 timestamp when the document was last updated
 * @returns A complete Firestore document object
 *
 * @example
 * ```typescript
 * const doc = createRESTObject(
 *   convert({ name: 'John', age: 30 }),
 *   'projects/myapp/databases/(default)/documents/users/123',
 *   '2024-01-15T12:00:00Z',
 *   '2024-01-15T12:00:00Z'
 * );
 * ```
 */
export function createRESTObject(
  fields: FirestoreResponseObjectField | null,
  name = '',
  createTime = '',
  updateTime = ''
): FirestoreResponseObject {
  return {
    name,
    fields,
    createTime,
    updateTime,
  }
}
