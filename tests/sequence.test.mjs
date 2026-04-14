import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { runShuffleSequence } from '../sequence.js';

const states = [];
const start = performance.now();

await runShuffleSequence({
  onStateChange: (state) => states.push(state)
});

const elapsedMs = performance.now() - start;

assert.deepEqual(states, [
  { phase: 'countdown', value: 3 },
  { phase: 'countdown', value: 2 },
  { phase: 'countdown', value: 1 },
  { phase: 'loading' },
  { phase: 'done' }
]);

// Tillåt liten jitter i testmiljön.
assert.equal(elapsedMs >= 4900, true);
assert.equal(elapsedMs <= 6200, true);

console.log('sequence tests passed');
