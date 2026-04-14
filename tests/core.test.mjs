import assert from 'node:assert/strict';
import { generatePlacement, validateRules } from '../core.js';

const layout = {
  oppositeSides: { left: 'right', right: 'left' },
  seats: [
    { id: 'L1', zone: 'left' },
    { id: 'L2', zone: 'left' },
    { id: 'R1', zone: 'right' },
    { id: 'R2', zone: 'right' }
  ]
};

assert.equal(validateRules(['A', 'B'], [{ a: 'A', b: 'B' }]), true);
assert.equal(validateRules(['A'], [{ a: 'A', b: 'B' }]), false);

for (let i = 0; i < 50; i += 1) {
  const result = generatePlacement({
    students: ['A', 'B', 'C', 'D'],
    rules: [{ a: 'A', b: 'B' }],
    layout,
    maxAttempts: 500
  });

  assert.equal(result.ok, true);
  const usedStudents = Object.values(result.placement);
  assert.equal(new Set(usedStudents).size, usedStudents.length);

  const seatByStudent = Object.entries(result.placement).reduce((acc, [seat, student]) => {
    acc[student] = seat;
    return acc;
  }, {});

  const zoneA = layout.seats.find((s) => s.id === seatByStudent.A).zone;
  const zoneB = layout.seats.find((s) => s.id === seatByStudent.B).zone;
  assert.equal(layout.oppositeSides[zoneA], zoneB);
}

const impossible = generatePlacement({
  students: ['A', 'B'],
  rules: [{ a: 'A', b: 'B' }],
  layout: {
    oppositeSides: { left: 'right', right: 'left' },
    seats: [
      { id: 'L1', zone: 'left' },
      { id: 'L2', zone: 'left' }
    ]
  },
  maxAttempts: 100
});
assert.equal(impossible.ok, false);

console.log('core tests passed');
