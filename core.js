function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function validateRules(students, rules) {
  const studentSet = new Set(students);
  return rules.every((rule) => studentSet.has(rule.a) && studentSet.has(rule.b) && rule.a !== rule.b);
}

export function generatePlacement({ students, rules, layout, maxAttempts = 500 }) {
  const seats = [...layout.seats];
  const usedStudents = students.slice(0, seats.length);

  if (usedStudents.length === 0) {
    return { ok: true, placement: {} };
  }

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const seatOrder = shuffled(seats);
    const studentOrder = shuffled(usedStudents);
    const placement = {};
    const studentToZone = {};

    for (let i = 0; i < studentOrder.length; i += 1) {
      const student = studentOrder[i];
      const seat = seatOrder[i];
      placement[seat.id] = student;
      studentToZone[student] = seat.zone;
    }

    const valid = rules.every((rule) => {
      const zoneA = studentToZone[rule.a];
      const zoneB = studentToZone[rule.b];

      if (!zoneA || !zoneB) {
        return true;
      }

      const opposite = layout.oppositeSides[zoneA];
      return opposite !== undefined && zoneB === opposite;
    });

    if (valid) {
      return { ok: true, placement };
    }
  }

  return {
    ok: false,
    error:
      'Ingen giltig placering kunde hittas som uppfyller alla sidregler. Justera reglerna eller layoutens zonindelning.'
  };
}
