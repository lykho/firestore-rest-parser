/**
 * Wrapper for Firestore Reference values.
 *
 * Represents a reference to another Firestore document.
 *
 * @example
 * ```typescript
 * const ref = new Reference('projects/my-project/databases/(default)/documents/users/user123');
 * convert({ author: ref });
 * // => { author: { referenceValue: "projects/my-project/databases/(default)/documents/users/user123" } }
 * ```
 */
export class Reference {
  /**
   * @param value - The full document path (e.g., "projects/{project}/databases/{database}/documents/{path}")
   */
  constructor(public value: string) {}
}
