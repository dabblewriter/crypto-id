#!/usr/bin/env node

const { createId, createSortableId } = require('./index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('🧪 Running Crypto ID Tests\n');

// Test createId function
test('createId() returns 16 char string by default', () => {
  const id = createId();
  assert(typeof id === 'string', 'should return string');
  assert(id.length === 16, `expected length 16, got ${id.length}`);
  assert(/^[0-9A-Za-z]+$/.test(id), 'should only contain base62 chars');
});

test('createId(length) respects custom length', () => {
  const id8 = createId(8);
  const id24 = createId(24);
  assert(id8.length === 8, `expected length 8, got ${id8.length}`);
  assert(id24.length === 24, `expected length 24, got ${id24.length}`);
});

test('createId() generates unique IDs', () => {
  const ids = new Set();
  for (let i = 0; i < 1000; i++) {
    ids.add(createId());
  }
  assert(ids.size === 1000, 'should generate 1000 unique IDs');
});

// Test createSortableId function
test('createSortableId() returns 16 char string', () => {
  const id = createSortableId();
  assert(typeof id === 'string', 'should return string');
  assert(id.length === 16, `expected length 16, got ${id.length}`);
  assert(/^[0-9A-Za-z]+$/.test(id), 'should only contain base62 chars');
});

test('createSortableId() format is 8+8 chars', () => {
  const id = createSortableId();
  assert(id.length === 16, 'total length should be 16');
  // Can't easily test exact timestamp format, but can verify structure
  const timestamp = id.substring(0, 8);
  const random = id.substring(8);
  assert(timestamp.length === 8, 'timestamp should be 8 chars');
  assert(random.length === 8, 'random should be 8 chars');
});

test('createSortableId() is lexicographically sortable', () => {
  const ids = [];
  for (let i = 0; i < 20; i++) {
    ids.push(createSortableId());
    // Small delay to potentially get different timestamps
    const start = Date.now();
    while (Date.now() - start < 1) {}
  }

  const sorted = ids.slice().sort();
  const isSorted = JSON.stringify(ids) === JSON.stringify(sorted);
  assert(isSorted, 'IDs should be naturally sorted by generation order');
});

test('createSortableId() handles same-millisecond monotonicity', () => {
  const ids = [];
  // Generate rapidly to trigger same-millisecond handling
  for (let i = 0; i < 10; i++) {
    ids.push(createSortableId());
  }

  // Check they're still sorted
  const sorted = ids.slice().sort();
  const isSorted = JSON.stringify(ids) === JSON.stringify(sorted);
  assert(isSorted, 'Same-millisecond IDs should still be properly ordered');

  // Check for uniqueness
  const unique = new Set(ids);
  assert(unique.size === ids.length, 'All IDs should be unique');
});

test('createSortableId() timestamp increases over time', () => {
  const id1 = createSortableId();

  // Wait a bit
  const start = Date.now();
  while (Date.now() - start < 10) {}

  const id2 = createSortableId();

  const ts1 = id1.substring(0, 8);
  const ts2 = id2.substring(0, 8);

  assert(ts2 >= ts1, 'Later timestamp should be >= earlier timestamp');
  assert(id2 > id1, 'Later ID should sort after earlier ID');
});

test('Base 62 character set is used correctly', () => {
  const ids = [];
  for (let i = 0; i < 100; i++) {
    ids.push(createId(100));
    ids.push(createSortableId());
  }

  const allChars = ids.join('');
  const base62Regex = /^[0-9A-Za-z]+$/;
  assert(base62Regex.test(allChars), 'Should only use base 62 characters');

  // Check we see diverse characters (statistical test)
  const charSet = new Set(allChars.split(''));
  assert(charSet.size > 50, 'Should use diverse character set');
});

// Summary
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('❌ Some tests failed');
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
}