import assert from 'node:assert/strict';
import {
  generatePlacement,
  hasUniqueSeatIds,
  validateModel,
  validateRules
} from '../core.js';
import { classroomLayout } from '../classroom-layout.js';

assert.equal(hasUniqueSeatIds(classroomLayout), true);
assert.equal(validateRules(['A', 'B'], [{ a: 'A', b: 'B' }]), true);
assert.equal(validateRules(['A'], [{ a: 'A', b: 'B' }]), false);

const seatIds = classroomLayout.seats.map((seat) => seat.id);
assert.equal(new Set(seatIds).size, 28);

const validModel = validateModel({
  students: ['A', 'B', 'C'],
  rules: [{ a: 'A', b: 'B' }],
  constraints: { A: ['01', '02'], B: ['16', '17'] },
  layout: classroomLayout
});
assert.equal(validModel.ok, true);

const impossibleRuleCombo = validateModel({
  students: ['A', 'B'],
  rules: [{ a: 'A', b: 'B' }],
  constraints: { A: ['01'], B: ['10'] },
  layout: classroomLayout
});
assert.equal(impossibleRuleCombo.ok, false);

const emptyConstraint = validateModel({
  students: ['A'],
  rules: [],
  constraints: { A: [] },
  layout: classroomLayout
});
assert.equal(emptyConstraint.ok, false);

for (let i = 0; i < 30; i += 1) {
  const result = generatePlacement({
    students: ['A', 'B', 'C', 'D'],
    rules: [{ a: 'A', b: 'B' }],
    constraints: {
      A: ['01', '02', '03'],
      B: ['16', '17', '18'],
      C: ['10', '11', '12'],
      D: ['25', '26']
    },
    layout: classroomLayout
  });

  assert.equal(result.ok, true);
  const usedStudents = Object.values(result.placement);
  assert.equal(new Set(usedStudents).size, usedStudents.length);

  const seatByStudent = Object.entries(result.placement).reduce((acc, [seatId, student]) => {
    acc[student] = seatId;
    return acc;
  }, {});

  assert.equal(['01', '02', '03'].includes(seatByStudent.A), true);
  assert.equal(['16', '17', '18'].includes(seatByStudent.B), true);

  const zoneA = classroomLayout.seats.find((seat) => seat.id === seatByStudent.A).zone;
  const zoneB = classroomLayout.seats.find((seat) => seat.id === seatByStudent.B).zone;
  assert.equal(classroomLayout.oppositeSides[zoneA], zoneB);
}

const impossible = generatePlacement({
  students: ['A', 'B'],
  rules: [{ a: 'A', b: 'B' }],
  constraints: { A: ['25'], B: ['26'] },
  layout: classroomLayout
});
assert.equal(impossible.ok, false);

console.log('core tests passed');
