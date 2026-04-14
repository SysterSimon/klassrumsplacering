function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function zonesForStudent(student, seats, allowedSeatIds) {
  const allowedSet = allowedSeatIds[student] || new Set(seats.map((seat) => seat.id));
  return new Set(seats.filter((seat) => allowedSet.has(seat.id)).map((seat) => seat.zone));
}

export function hasUniqueSeatIds(layout) {
  const seatIds = layout.seats.map((seat) => seat.id);
  return new Set(seatIds).size === seatIds.length;
}

export function normalizeConstraints(constraints) {
  const normalized = {};
  for (const [student, seatIds] of Object.entries(constraints || {})) {
    normalized[student] = new Set((seatIds || []).map((seatId) => String(seatId)));
  }
  return normalized;
}

export function validateRules(students, rules) {
  const studentSet = new Set(students);
  return rules.every((rule) => studentSet.has(rule.a) && studentSet.has(rule.b) && rule.a !== rule.b);
}

export function validateModel({ students, rules, constraints, layout }) {
  if (!hasUniqueSeatIds(layout)) {
    return { ok: false, error: 'Layouten innehåller dubbla platsnummer. Varje platsnummer måste vara unikt.' };
  }

  if (students.length > layout.seats.length) {
    return { ok: false, error: 'Det finns fler elever än platser i klassrummet.' };
  }

  const studentSet = new Set(students);
  const seatIdSet = new Set(layout.seats.map((seat) => seat.id));
  const normalizedConstraints = normalizeConstraints(constraints);

  for (const [student, allowed] of Object.entries(normalizedConstraints)) {
    if (!studentSet.has(student)) {
      return { ok: false, error: `Platsbegränsning finns för okänd elev: ${student}.` };
    }

    if (allowed.size === 0) {
      return { ok: false, error: `Eleven ${student} saknar tillåtna platser.` };
    }

    for (const seatId of allowed.values()) {
      if (!seatIdSet.has(seatId)) {
        return { ok: false, error: `Platsnummer ${seatId} finns inte i layouten.` };
      }
    }
  }

  if (!validateRules(students, rules)) {
    return { ok: false, error: 'En eller flera sidregler är ogiltiga.' };
  }

  for (const rule of rules) {
    const zonesA = zonesForStudent(rule.a, layout.seats, normalizedConstraints);
    const zonesB = zonesForStudent(rule.b, layout.seats, normalizedConstraints);

    let hasCompatiblePair = false;
    for (const zoneA of zonesA.values()) {
      const opposite = layout.oppositeSides[zoneA];
      if (opposite && zonesB.has(opposite)) {
        hasCompatiblePair = true;
        break;
      }
    }

    if (!hasCompatiblePair) {
      return {
        ok: false,
        error: `Regelkombinationen för ${rule.a} och ${rule.b} är omöjlig med nuvarande platsbegränsningar/zoner.`
      };
    }
  }

  return { ok: true, constraints: normalizedConstraints };
}

function respectsRuleForAssignment(student, seat, rulesByStudent, assignedSeatByStudent, seatById, oppositeSides) {
  const linkedRules = rulesByStudent[student] || [];

  for (const otherStudent of linkedRules) {
    const otherSeatId = assignedSeatByStudent[otherStudent];
    if (!otherSeatId) continue;

    const otherSeat = seatById[otherSeatId];
    const expectedOpposite = oppositeSides[seat.zone];
    if (!expectedOpposite || otherSeat.zone !== expectedOpposite) {
      return false;
    }
  }

  return true;
}

export function generatePlacement({ students, rules, constraints, layout, maxAttempts = 50 }) {
  const modelValidation = validateModel({ students, rules, constraints, layout });
  if (!modelValidation.ok) {
    return { ok: false, error: modelValidation.error };
  }

  const normalizedConstraints = modelValidation.constraints;
  const seats = layout.seats;
  const seatById = Object.fromEntries(seats.map((seat) => [seat.id, seat]));
  const allSeatIds = seats.map((seat) => seat.id);

  const allowedSeatsByStudent = {};
  students.forEach((student) => {
    const constrained = normalizedConstraints[student];
    allowedSeatsByStudent[student] = constrained ? [...constrained] : [...allSeatIds];
  });

  const rulesByStudent = {};
  rules.forEach((rule) => {
    if (!rulesByStudent[rule.a]) rulesByStudent[rule.a] = [];
    if (!rulesByStudent[rule.b]) rulesByStudent[rule.b] = [];
    rulesByStudent[rule.a].push(rule.b);
    rulesByStudent[rule.b].push(rule.a);
  });

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const assignedSeatByStudent = {};
    const usedSeatIds = new Set();

    const orderedStudents = shuffled(students).sort(
      (a, b) => allowedSeatsByStudent[a].length - allowedSeatsByStudent[b].length
    );

    function backtrack(index) {
      if (index === orderedStudents.length) {
        return true;
      }

      const student = orderedStudents[index];
      const candidates = shuffled(allowedSeatsByStudent[student]).filter((seatId) => !usedSeatIds.has(seatId));

      for (const seatId of candidates) {
        const seat = seatById[seatId];
        if (
          !respectsRuleForAssignment(
            student,
            seat,
            rulesByStudent,
            assignedSeatByStudent,
            seatById,
            layout.oppositeSides
          )
        ) {
          continue;
        }

        assignedSeatByStudent[student] = seatId;
        usedSeatIds.add(seatId);

        if (backtrack(index + 1)) {
          return true;
        }

        delete assignedSeatByStudent[student];
        usedSeatIds.delete(seatId);
      }

      return false;
    }

    if (backtrack(0)) {
      const placement = {};
      for (const [student, seatId] of Object.entries(assignedSeatByStudent)) {
        placement[seatId] = student;
      }
      return { ok: true, placement };
    }
  }

  return {
    ok: false,
    error:
      'Ingen giltig placering kunde hittas. Kontrollera platsbegränsningar, sidregler och antal elever/platsnummer.'
  };
}
