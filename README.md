# Crypto ID

Create random alphanumeric IDs of any length using the browser crypto API.

## Installation

```
npm install crypto-id
```

## Usage

The number of ids possible is 62^n where n is the length of the string.

```ts
import { createId } from 'crypto-id';

createId(); // RJPoz4veOGn9nbDILhmfga3n (length 24 by default) 1.040879722e43 possible ids
createId(12); // GS7rPnA0mmbv (3.226266762e21 possible ids)
createId(4); // vMH6 (14,776,336 possible ids)
```
