/**
 * Creates a cryptographically secure random ID using base 62 encoding.
 *
 * Uses Node.js crypto.webcrypto or browser crypto.getRandomValues() API to generate
 * secure random bytes, then encodes them using characters 0-9, A-Z, a-z for URL-safe, readable IDs.
 *
 * @param length - The length of the ID to generate (default: 16)
 * @returns A random alphanumeric string of the specified length
 *
 * @example
 * ```typescript
 * createId();     // "RJPoz4veOGn9nbDI" (16 chars, ~4.7e28 possibilities)
 * createId(12);   // "GS7rPnA0mmbv" (~3.22e21 possibilities)
 * createId(4);    // "vMH6" (~14.7M possibilities)
 * ```
 *
 * @remarks
 * The number of possible IDs is 62^length. The function uses a rejection sampling
 * approach to ensure uniform distribution across the character set.
 */
export declare function createId(length?: number): string;
/**
 * Creates a sortable identifier using base 62 encoding.
 * Format: [timestamp][randomness]
 * - First 8 characters: timestamp component (milliseconds since Unix epoch, good until year 8888)
 * - Last 8 characters: random component
 * Total length: 16 characters
 *
 * The IDs are lexicographically sortable and will naturally sort by creation time.
 * Implements monotonicity: multiple IDs generated in the same millisecond will be properly ordered.
 */
export declare function createSortableId(): string;
