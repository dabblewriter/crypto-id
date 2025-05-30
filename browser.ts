const chars = ('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').split('');
let bytes = new Uint8Array(0);
let position = 0;

// State for ULID monotonicity
let lastTimestamp = 0;
let lastRandomPart = '';

/**
 * Creates a cryptographically secure random ID using base 62 encoding.
 *
 * Uses the browser's crypto.getRandomValues() API to generate secure random bytes,
 * then encodes them using characters 0-9, A-Z, a-z for URL-safe, readable IDs.
 *
 * @param length - The length of the ID to generate (default: 16)
 * @returns A random alphanumeric string of the specified length
 *
 * @example
 * ```typescript
 * createId();     // "RJPoz4veOGn9nbDI" (16 chars, ~4.7e28 possibilities)
 * createId(24);   // "RJPoz4veOGn9nbDILhmfga3n" (24 chars, ~1.04e43 possibilities)
 * createId(12);   // "GS7rPnA0mmbv" (~3.22e21 possibilities)
 * createId(4);    // "vMH6" (~14.7M possibilities)
 * ```
 *
 * @remarks
 * The number of possible IDs is 62^length. The function uses a rejection sampling
 * approach to ensure uniform distribution across the character set.
 */
export function createId(length = 16) {
  let id = '';
  while (id.length < length) {
    if (position === bytes.length) {
      bytes = crypto.getRandomValues(new Uint8Array(40));
      position = 0;
    }
    for (; position < bytes.length; position++) {
      const b = bytes[position];
      // Length of `chars` is 62. We only take bytes between 0 and 62*4-1 (both inclusive). The value is then evenly
      // mapped to indices of `chars` via a modulo operation.
      const maxValue = 62 * 4 - 1;
      if (b <= maxValue) {
        id += chars[b % 62];
      }
      if (id.length >= length) break;
    }
  }
  return id;
}

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
export function createSortableId(): string {
  const timestamp = Date.now();

  // Convert timestamp to base 62 (8 characters, padded with leading zeros if needed)
  let timestampStr = encodeBase62(timestamp);
  // Pad to 8 characters for consistent sorting (good until year 8888)
  timestampStr = timestampStr.padStart(8, '0');

  let randomPart: string;

  if (timestamp === lastTimestamp) {
    // Same millisecond - increment the random part for monotonicity
    randomPart = incrementBase62(lastRandomPart);
    if (!randomPart) {
      // Extremely unlikely overflow - but better safe than sorry
      throw new Error('Sortable ID overflow: too many IDs generated in the same millisecond');
    }
  } else {
    // New millisecond - generate fresh random part
    randomPart = createId(8);
    lastTimestamp = timestamp;
  }

  lastRandomPart = randomPart;
  return timestampStr + randomPart;
}

/**
 * Increments a base 62 string by 1, handling carry operations.
 * Returns null if overflow occurs (all characters are 'z').
 */
function incrementBase62(str: string): string | null {
  const arr = str.split('');
  let carry = 1;

  // Start from the right-most character and work backwards
  for (let i = arr.length - 1; i >= 0 && carry > 0; i--) {
    const currentIndex = chars.indexOf(arr[i]);
    const newIndex = currentIndex + carry;

    if (newIndex < chars.length) {
      // No carry needed
      arr[i] = chars[newIndex];
      carry = 0;
    } else {
      // Carry to next position
      arr[i] = chars[0]; // Reset to '0'
      carry = 1;
    }
  }

  // If we still have carry, it means overflow
  if (carry > 0) {
    return null;
  }

  return arr.join('');
}

/**
 * Encodes a number to base 62 using the character set 0-9, A-Z, a-z
 */
function encodeBase62(num: number): string {
  if (num === 0) return '0';

  let result = '';
  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}
