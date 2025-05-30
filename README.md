# Crypto ID

Create cryptographically secure random alphanumeric IDs and sortable identifiers using the browser crypto API.

## Installation

```bash
npm install crypto-id
```

## Features

- 🔐 **Cryptographically secure** - Uses `crypto.getRandomValues()`
- 🌐 **Universal** - Works in browsers and Node.js
- 📝 **URL-safe** - Base 62 encoding (0-9, A-Z, a-z)
- ⚡ **Fast** - Efficient rejection sampling for uniform distribution
- 🕒 **Sortable IDs** - Timestamp-based IDs with lexicographical sorting
- 📦 **Lightweight** - No dependencies

## API

### `createId(length?: number): string`

Creates a cryptographically secure random ID of any length.

```typescript
import { createId } from 'crypto-id';

createId();     // "RJPoz4veOGn9nbDI" (16 chars, ~4.7e28 possibilities)
createId(12);   // "GS7rPnA0mmbv" (~3.22e21 possibilities)
createId(4);    // "vMH6" (~14.7M possibilities)
```

**Parameters:**
- `length` (optional): Length of the ID (default: 16)

**Returns:** Random alphanumeric string

The number of possible IDs is `62^length`.

### `createSortableId(): string`

Creates a sortable identifier that's lexicographically ordered by creation time.

```typescript
import { createSortableId } from 'crypto-id';

createSortableId(); // "0UmdJLiDuEbwhJfL" (16 chars, sortable by time)
createSortableId(); // "0UmdJLiDuEbwhJfM" (increments if same millisecond)
```

**Returns:** 16-character sortable identifier

## Sortable ID Format

Our sortable IDs use the format: `TTTTTTTTRRRRRRRR`

- **8 characters**: Timestamp (base 62 encoded milliseconds, good until year 8888)
- **8 characters**: Random component

```
Example: 0UmdJLiDuEbwhJfL
         ┬───────┬───────
         │       └─ Random (8 chars)
         └──────── Timestamp (8 chars)
```

This ensures:
- ✅ Lexicographical sorting matches chronological order
- ✅ No collisions within the same millisecond
- ✅ Optimal database indexing performance

## What Makes These Special?

### 🎯 **Universally Unique**
With 62⁸ random combinations per millisecond, collisions are astronomically unlikely.

### 📊 **Database Friendly**
- Lexicographically sortable by creation time
- Excellent for database indexing
- Better performance than UUIDs for time-ordered data

### 🔒 **Cryptographically Secure**
Both functions use secure random generation, making IDs unpredictable and safe for security-sensitive applications.

### ⚡ **Optimized for Reality**
- Extensive timestamp range (until year 8888)
- Excellent collision resistance (2.18×10¹⁴ combinations/ms)
- Compact 16-character format

## Monotonicity

Sortable IDs handle multiple generations within the same millisecond:

```typescript
// Same millisecond - automatic increment
const id1 = createSortableId(); // "0UmdJLiDuEbwhJfL"
const id2 = createSortableId(); // "0UmdJLiDuEbwhJfM"
const id3 = createSortableId(); // "0UmdJLiDuEbwhJfN"

// Different millisecond - fresh random component
// (after delay)
const id4 = createSortableId(); // "0UmdJLiEX87wJp4H"
```

This ensures:
- ✅ Lexicographical sorting matches chronological order
- ✅ No collisions within the same millisecond
- ✅ Optimal database indexing performance

## Performance

- **`createId`**: Pure random generation, fastest
- **`createSortableId`**: Timestamp + monotonicity handling, minimal overhead

Both functions use efficient rejection sampling for uniform distribution and batch random byte generation for optimal performance.

## Browser and Node.js Support

Works seamlessly in both environments:
- **Browser**: Uses `crypto.getRandomValues()`
- **Node.js**: Uses `crypto.webcrypto.getRandomValues()`

## TypeScript

Full TypeScript support included with comprehensive type definitions.

```typescript
import { createId, createSortableId } from 'crypto-id';

const randomId: string = createId(12);
const sortableId: string = createSortableId();
```

## Development

This package includes a comprehensive test suite that covers all functionality:

```bash
# Run tests
npm test

# Build TypeScript
npm run build

# Build and test (runs automatically before publishing)
npm run prepare
```

The test suite verifies:
- ✅ Correct ID lengths and formats
- ✅ Base 62 character set usage
- ✅ Uniqueness and collision resistance
- ✅ Sortable ID monotonicity and ordering
- ✅ Timestamp progression over time
