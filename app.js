const classroomLayout = {
  id: 'klassrum-fast-layout-v2',
  zones: ['left', 'middle', 'right', 'back'],
  seats: [
    { id: '01', label: '01', zone: 'left', section: 'leftBlock', row: 1, col: 1 },
    { id: '02', label: '02', zone: 'left', section: 'leftBlock', row: 1, col: 2 },
    { id: '03', label: '03', zone: 'left', section: 'leftBlock', row: 1, col: 3 },
    { id: '04', label: '04', zone: 'left', section: 'leftBlock', row: 2, col: 1 },
    { id: '05', label: '05', zone: 'left', section: 'leftBlock', row: 2, col: 2 },
    { id: '06', label: '06', zone: 'left', section: 'leftBlock', row: 2, col: 3 },
    { id: '07', label: '07', zone: 'left', section: 'leftBlock', row: 3, col: 1 },
    { id: '08', label: '08', zone: 'left', section: 'leftBlock', row: 3, col: 2 },
    { id: '09', label: '09', zone: 'left', section: 'leftBlock', row: 3, col: 3 },

    { id: '10', label: '10', zone: 'middle', section: 'middleBlock', row: 1, col: 1 },
    { id: '11', label: '11', zone: 'middle', section: 'middleBlock', row: 1, col: 2 },
    { id: '12', label: '12', zone: 'middle', section: 'middleBlock', row: 2, col: 1 },
    { id: '13', label: '13', zone: 'middle', section: 'middleBlock', row: 2, col: 2 },
    { id: '14', label: '14', zone: 'middle', section: 'middleBlock', row: 3, col: 1 },
    { id: '15', label: '15', zone: 'middle', section: 'middleBlock', row: 3, col: 2 },

    { id: '16', label: '16', zone: 'right', section: 'rightBlock', row: 1, col: 1 },
    { id: '17', label: '17', zone: 'right', section: 'rightBlock', row: 1, col: 2 },
    { id: '18', label: '18', zone: 'right', section: 'rightBlock', row: 1, col: 3 },
    { id: '19', label: '19', zone: 'right', section: 'rightBlock', row: 2, col: 1 },
    { id: '20', label: '20', zone: 'right', section: 'rightBlock', row: 2, col: 2 },
    { id: '21', label: '21', zone: 'right', section: 'rightBlock', row: 2, col: 3 },
    { id: '22', label: '22', zone: 'right', section: 'rightBlock', row: 3, col: 1 },
    { id: '23', label: '23', zone: 'right', section: 'rightBlock', row: 3, col: 2 },
    { id: '24', label: '24', zone: 'right', section: 'rightBlock', row: 3, col: 3 },

    { id: '25', label: '25', zone: 'back', section: 'backRow', row: 1, col: 1 },
    { id: '26', label: '26', zone: 'back', section: 'backRow', row: 1, col: 2 },
    { id: '27', label: '27', zone: 'back', section: 'backRow', row: 1, col: 3 },
    { id: '28', label: '28', zone: 'back', section: 'backRow', row: 1, col: 4 }
  ]
};

const STORAGE_KEYS = {
  students: 'klassrum.standardlista.v1',
  rules: 'klassrum.regler.v2',
  constraints: 'klassrum.platsbegransningar.v2',
  avoid: 'klassrum.mindre_atravarda.v1',
  attendance: 'klassrum.narvaro.v1'
};

const DEFAULT_STUDENTS = ['Anna', 'Bo', 'Cecilia', 'David', 'Elin', 'Farid', 'Greta', 'Hasan'];

const state = {
  students: loadList(STORAGE_KEYS.students, DEFAULT_STUDENTS),
  rules: loadList(STORAGE_KEYS.rules, []),
  constraints: loadObject(STORAGE_KEYS.constraints, {}),
  avoid: loadObject(STORAGE_KEYS.avoid, {}),
  attendance: loadObject(STORAGE_KEYS.attendance, {}),
  placement: {},
  isShuffling: false,
  importStatus: ''
};

const els = {
  studentList: document.getElementById('student-list'),
  studentCountText: document.getElementById('student-count-text'),
  attendanceCountText: document.getElementById('attendance-count-text'),
  addStudentForm: document.getElementById('add-student-form'),
  newStudentName: document.getElementById('new-student-name'),
  saveStudentsBtn: document.getElementById('save-students-btn'),
  importStudentsFile: document.getElementById('import-students-file'),
  importStudentsBtn: document.getElementById('import-students-btn'),
  importStatus: document.getElementById('import-status'),
  exportSettingsBtn: document.getElementById('export-settings-btn'),
  importSettingsFile: document.getElementById('import-settings-file'),
  importSettingsBtn: document.getElementById('import-settings-btn'),

  ruleStudentA: document.getElementById('rule-student-a'),
  ruleStudentB: document.getElementById('rule-student-b'),
  addRuleForm: document.getElementById('add-rule-form'),
  rulesList: document.getElementById('rules-list'),

  constraintStudent: document.getElementById('constraint-student'),
  constraintSeats: document.getElementById('constraint-seats'),
  setConstraintForm: document.getElementById('set-constraint-form'),
  constraintsList: document.getElementById('constraints-list'),

  avoidStudent: document.getElementById('avoid-student'),
  avoidSeats: document.getElementById('avoid-seats'),
  setAvoidForm: document.getElementById('set-avoid-form'),
  avoidList: document.getElementById('avoid-list'),

  saveRulesBtn: document.getElementById('save-rules-btn'),

  classroomStatus: document.getElementById('classroom-status'),
  classroomLayout: document.getElementById('classroom-layout'),
  leftBlockGrid: document.getElementById('left-block-grid'),
  middleBlockGrid: document.getElementById('middle-block-grid'),
  rightBlockGrid: document.getElementById('right-block-grid'),
  backRowGrid: document.getElementById('back-row-grid'),

  shuffleBtn: document.getElementById('shuffle-btn'),
  clearPlacementBtn: document.getElementById('clear-placement-btn'),

  shuffleOverlay: document.getElementById('shuffle-overlay'),
  shuffleOverlayBody: document.getElementById('shuffle-overlay-body'),
  mapModal: document.getElementById('map-modal'),
  mapModalBody: document.getElementById('map-modal-body'),
  closeMapModalBtn: document.getElementById('close-map-modal-btn'),
  emptyListTemplate: document.getElementById('empty-list-template')
};

function loadList(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return [...fallback];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...fallback];
  } catch {
    return [...fallback];
  }
}

function loadObject(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return { ...fallback };
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : { ...fallback };
  } catch {
    return { ...fallback };
  }
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function normalizeStudentName(name) {
  return String(name).replace(/\s+/g, ' ').trim();
}


function isPresent(student) {
  return state.attendance[student] !== false;
}

function getPresentStudents() {
  return state.students.filter((student) => isPresent(student));
}

function getActiveRules() {
  const presentSet = new Set(getPresentStudents());
  return state.rules.filter((rule) => presentSet.has(rule.a) && presentSet.has(rule.b));
}

function getActiveSeatMap(mapObj) {
  const presentSet = new Set(getPresentStudents());
  return Object.fromEntries(Object.entries(mapObj).filter(([student]) => presentSet.has(student)));
}

function saveAllStateToLocalStorage() {
  localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(state.students));
  localStorage.setItem(STORAGE_KEYS.rules, JSON.stringify(state.rules));
  localStorage.setItem(STORAGE_KEYS.constraints, JSON.stringify(state.constraints));
  localStorage.setItem(STORAGE_KEYS.avoid, JSON.stringify(state.avoid));
  localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(state.attendance));
}

function ensureAttendanceState() {
  state.students.forEach((student) => {
    if (!(student in state.attendance)) state.attendance[student] = true;
  });
  Object.keys(state.attendance).forEach((student) => {
    if (!state.students.includes(student)) delete state.attendance[student];
  });
}

function setAttendance(student, present) {
  state.attendance[student] = Boolean(present);
  if (!present) {
    state.placement = Object.fromEntries(Object.entries(state.placement).filter(([, assignedStudent]) => assignedStudent !== student));
  }
  saveAllStateToLocalStorage();
  ensureAttendanceState();
  render();
  setStatus(`${escapeHtml(student)} är nu ${present ? 'närvarande' : 'frånvarande'}.`, 'ok');
}

function expandStudentsSelection(studentValue) {
  if (studentValue === '__ALL__') return [...state.students];
  return studentValue ? [studentValue] : [];
}

function setStatus(message, type = 'neutral') {
  els.classroomStatus.innerHTML = message;
  els.classroomStatus.className = `status ${type}`.trim();
}

function appendEmptyState(listEl, text) {
  const fragment = els.emptyListTemplate.content.cloneNode(true);
  fragment.querySelector('.empty-state').textContent = text;
  listEl.appendChild(fragment);
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(state.students));
  localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(state.attendance));
  setStatus('Standardlistan har sparats lokalt.', 'ok');
}

function saveRulesAndConstraints() {
  localStorage.setItem(STORAGE_KEYS.rules, JSON.stringify(state.rules));
  localStorage.setItem(STORAGE_KEYS.constraints, JSON.stringify(state.constraints));
  localStorage.setItem(STORAGE_KEYS.avoid, JSON.stringify(state.avoid));
  localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(state.attendance));
  setStatus('Regler har sparats lokalt.', 'ok');
}

function updateStudentCount() {
  const count = state.students.length;
  const presentCount = getPresentStudents().length;
  const absentCount = count - presentCount;
  els.studentCountText.textContent = `${count} ${count === 1 ? 'elev' : 'elever'} i standardlistan`;
  if (els.attendanceCountText) {
    els.attendanceCountText.textContent = `${presentCount} närvarande${absentCount ? `, ${absentCount} frånvarande` : ''}`;
  }
}

function addStudent(name) {
  const clean = normalizeStudentName(name);
  if (!clean) return false;
  if (state.students.includes(clean)) {
    setStatus(`Eleven "${escapeHtml(clean)}" finns redan.`, 'error');
    return false;
  }
  state.students.push(clean);
  state.attendance[clean] = true;
  state.students.sort((a, b) => a.localeCompare(b, 'sv'));
  saveAllStateToLocalStorage();
  render();
  setStatus(`Eleven ${escapeHtml(clean)} lades till i standardlistan.`, 'ok');
  return true;
}

function removeStudent(name) {
  state.students = state.students.filter((student) => student !== name);
  state.rules = state.rules.filter((rule) => rule.a !== name && rule.b !== name);
  delete state.constraints[name];
  delete state.avoid[name];
  delete state.attendance[name];
  state.placement = Object.fromEntries(Object.entries(state.placement).filter(([, student]) => student !== name));
  saveAllStateToLocalStorage();
  render();
  setStatus(`Eleven ${escapeHtml(name)} togs bort.`, 'ok');
}

function addRule(a, b) {
  const selectedA = expandStudentsSelection(a);
  const selectedB = expandStudentsSelection(b);
  if (selectedA.length === 0 || selectedB.length === 0) {
    setStatus('Regeln kräver två olika elevval.', 'error');
    return;
  }
  const pairsToAdd = [];
  selectedA.forEach((studentA) => {
    selectedB.forEach((studentB) => {
      if (studentA === studentB) return;
      const key = [studentA, studentB].sort((x, y) => x.localeCompare(y, 'sv'));
      pairsToAdd.push({ a: key[0], b: key[1] });
    });
  });
  const uniquePairs = [];
  const seen = new Set();
  pairsToAdd.forEach((pair) => {
    const key = `${pair.a}__${pair.b}`;
    if (seen.has(key)) return;
    seen.add(key);
    uniquePairs.push(pair);
  });
  const before = state.rules.length;
  uniquePairs.forEach((pair) => {
    const exists = state.rules.some((rule) => (rule.a === pair.a && rule.b === pair.b) || (rule.a === pair.b && rule.b === pair.a));
    if (!exists) state.rules.push(pair);
  });
  if (state.rules.length === before) {
    setStatus('Inga nya regler lades till.', 'error');
    return;
  }
  state.rules.sort((left, right) => `${left.a}${left.b}`.localeCompare(`${right.a}${right.b}`, 'sv'));
  saveAllStateToLocalStorage();
  render();
  setStatus(`${state.rules.length - before} regel${state.rules.length - before === 1 ? '' : 'r'} tillagd${state.rules.length - before === 1 ? '' : 'a'}.`, 'ok');
}

function removeRule(a, b) {
  state.rules = state.rules.filter((rule) => !((rule.a === a && rule.b === b) || (rule.a === b && rule.b === a)));
  render();
  setStatus(`Regel borttagen för ${escapeHtml(a)} och ${escapeHtml(b)}.`, 'ok');
}

function setConstraint(student, seatIds) {
  const selectedStudents = expandStudentsSelection(student);
  if (selectedStudents.length === 0) {
    setStatus('Välj elev för tillåtna platser.', 'error');
    return;
  }
  if (seatIds.length === 0) {
    setStatus('Välj minst en tillåten plats.', 'error');
    return;
  }
  const normalizedSeats = [...new Set(seatIds.map(String))].sort((a, b) => a.localeCompare(b, 'sv'));
  selectedStudents.forEach((studentName) => {
    state.constraints[studentName] = [...normalizedSeats];
  });
  saveAllStateToLocalStorage();
  render();
  setStatus(`Tillåtna platser sparade för ${selectedStudents.length === 1 ? escapeHtml(selectedStudents[0]) : 'valda elever'}.`, 'ok');
}

function removeConstraint(student) {
  delete state.constraints[student];
  saveAllStateToLocalStorage();
  render();
  setStatus(`Tillåtna platser borttagna för ${escapeHtml(student)}.`, 'ok');
}

function setAvoidSeats(student, seatIds) {
  const selectedStudents = expandStudentsSelection(student);
  if (selectedStudents.length === 0) {
    setStatus('Välj elev för mindre åtråvärda platser.', 'error');
    return;
  }
  if (seatIds.length === 0) {
    setStatus('Välj minst en mindre åtråvärd plats.', 'error');
    return;
  }
  const normalizedSeats = [...new Set(seatIds.map(String))].sort((a, b) => a.localeCompare(b, 'sv'));
  selectedStudents.forEach((studentName) => {
    state.avoid[studentName] = [...normalizedSeats];
  });
  saveAllStateToLocalStorage();
  render();
  setStatus(`Mindre åtråvärda platser sparade för ${selectedStudents.length === 1 ? escapeHtml(selectedStudents[0]) : 'valda elever'}.`, 'ok');
}

function removeAvoidSeats(student) {
  delete state.avoid[student];
  saveAllStateToLocalStorage();
  render();
  setStatus(`Mindre åtråvärda platser borttagna för ${escapeHtml(student)}.`, 'ok');
}

function clearPlacement() {
  state.placement = {};
  closeMapModal();
  renderClassroom();
  setStatus('Aktuell placering rensad.', 'ok');
}

function setShuffleButtonsState(isBusy) {
  state.isShuffling = isBusy;
  els.shuffleBtn.disabled = isBusy;
  els.clearPlacementBtn.disabled = isBusy;
}

function updateShuffleOverlay(phaseState) {
  if (phaseState.phase === 'countdown') {
    els.shuffleOverlayBody.innerHTML = `
      <div class="shuffle-countdown">${phaseState.value}</div>
      <p class="shuffle-copy">Slumpning startar om ${phaseState.value} sekund${phaseState.value === 1 ? '' : 'er'}.</p>
    `;
    return;
  }
  if (phaseState.phase === 'loading') {
    els.shuffleOverlayBody.innerHTML = `
      <div class="spinner" aria-hidden="true"></div>
      <p class="shuffle-copy">Bearbetar placering och kontrollerar regler.</p>
    `;
  }
}

function showShuffleOverlay() {
  els.shuffleOverlay.classList.remove('hidden');
  els.shuffleOverlay.setAttribute('aria-hidden', 'false');
}

function hideShuffleOverlay() {
  els.shuffleOverlay.classList.add('hidden');
  els.shuffleOverlay.setAttribute('aria-hidden', 'true');
  els.shuffleOverlayBody.innerHTML = '';
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runShuffleSequence({ onStateChange, waitFn = wait }) {
  onStateChange({ phase: 'countdown', value: 3 });
  await waitFn(1000);
  onStateChange({ phase: 'countdown', value: 2 });
  await waitFn(1000);
  onStateChange({ phase: 'countdown', value: 1 });
  await waitFn(1000);
  onStateChange({ phase: 'loading' });
  await waitFn(900);
  onStateChange({ phase: 'done' });
}

function hasUniqueSeatIds(layout) {
  const ids = layout.seats.map((seat) => seat.id);
  return new Set(ids).size === ids.length;
}

function seatByIdMap(layout) {
  return Object.fromEntries(layout.seats.map((seat) => [seat.id, seat]));
}

function hasRuleCompatibility(rule, constraints, layout) {
  const seatById = seatByIdMap(layout);
  const aAllowed = constraints[rule.a] || layout.seats.map((seat) => seat.id);
  const bAllowed = constraints[rule.b] || layout.seats.map((seat) => seat.id);
  return aAllowed.some((aSeatId) => {
    const aSeat = seatById[aSeatId];
    return bAllowed.some((bSeatId) => {
      const bSeat = seatById[bSeatId];
      return aSeat.section !== bSeat.section && aSeat.row !== bSeat.row;
    });
  });
}

function validateRules(students, rules) {
  const studentSet = new Set(students);
  return rules.every((rule) => rule.a && rule.b && rule.a !== rule.b && studentSet.has(rule.a) && studentSet.has(rule.b));
}

function validateSeatMapByStudent(students, mapObj, layout, label) {
  const seatIds = new Set(layout.seats.map((seat) => seat.id));
  for (const student of Object.keys(mapObj)) {
    if (!students.includes(student)) {
      return { ok: false, error: `${label} finns för okänd elev: ${student}.` };
    }
    const seatList = mapObj[student];
    if (!Array.isArray(seatList) || seatList.length === 0) {
      return { ok: false, error: `${label} för ${student} saknar platser.` };
    }
    for (const seatId of seatList) {
      if (!seatIds.has(seatId)) {
        return { ok: false, error: `Ogiltigt platsnummer i ${label.toLowerCase()} för ${student}: ${seatId}.` };
      }
    }
  }
  return { ok: true };
}

function validateModel({ students, rules, constraints = {}, avoid = {}, layout }) {
  if (!Array.isArray(students) || students.length === 0) return { ok: false, error: 'Det finns inga elever att placera.' };
  if (!hasUniqueSeatIds(layout)) return { ok: false, error: 'Layouten innehåller dubbla platsnummer.' };
  if (students.length > layout.seats.length) return { ok: false, error: 'Antalet elever överstiger antalet platser i klassrummet.' };
  if (!validateRules(students, rules)) return { ok: false, error: 'Minst en regel innehåller ogiltiga elevnamn.' };

  const constraintsValidation = validateSeatMapByStudent(students, constraints, layout, 'Tillåtna platser');
  if (!constraintsValidation.ok) return constraintsValidation;

  const avoidValidation = validateSeatMapByStudent(students, avoid, layout, 'Mindre åtråvärda platser');
  if (!avoidValidation.ok) return avoidValidation;

  for (const rule of rules) {
    if (!hasRuleCompatibility(rule, constraints, layout)) {
      return { ok: false, error: `Regeln mellan ${rule.a} och ${rule.b} kan inte uppfyllas med nuvarande tillåtna platser.` };
    }
  }

  return { ok: true };
}

function shuffled(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function respectsRuleForAssignment(student, seat, rulesByStudent, assignedSeatByStudent, seatById) {
  const linkedStudents = rulesByStudent[student] || [];
  return linkedStudents.every((otherStudent) => {
    const otherSeatId = assignedSeatByStudent[otherStudent];
    if (!otherSeatId) return true;
    const otherSeat = seatById[otherSeatId];
    return seat.section !== otherSeat.section && seat.row !== otherSeat.row;
  });
}

function orderSeatsForStudent(student, candidateSeatIds, avoid) {
  const avoidSet = new Set(avoid[student] || []);
  return shuffled(candidateSeatIds).sort((a, b) => Number(avoidSet.has(a)) - Number(avoidSet.has(b)));
}

function buildPlacementByStudent(assignedSeatByStudent) {
  const placement = {};
  for (const [student, seatId] of Object.entries(assignedSeatByStudent)) {
    placement[seatId] = student;
  }
  return placement;
}

function countLonelyRows(placement, layout) {
  const seatById = seatByIdMap(layout);
  const rowGroups = new Map();
  Object.keys(placement).forEach((seatId) => {
    const seat = seatById[seatId];
    if (!seat) return;
    const key = `${seat.section}:${seat.row}`;
    rowGroups.set(key, (rowGroups.get(key) || 0) + 1);
  });
  let lonelyRows = 0;
  for (const count of rowGroups.values()) {
    if (count === 1) lonelyRows += 1;
  }
  return lonelyRows;
}

function countAvoidAssignments(assignedSeatByStudent, avoid) {
  let count = 0;
  for (const [student, seatId] of Object.entries(assignedSeatByStudent)) {
    if ((avoid[student] || []).includes(seatId)) count += 1;
  }
  return count;
}

function scorePlacement(assignedSeatByStudent, avoid, layout) {
  const placement = buildPlacementByStudent(assignedSeatByStudent);
  return {
    placement,
    lonelyRows: countLonelyRows(placement, layout),
    avoidHits: countAvoidAssignments(assignedSeatByStudent, avoid)
  };
}

function isBetterScore(nextScore, bestScore) {
  if (!bestScore) return true;
  if (nextScore.lonelyRows !== bestScore.lonelyRows) return nextScore.lonelyRows < bestScore.lonelyRows;
  if (nextScore.avoidHits !== bestScore.avoidHits) return nextScore.avoidHits < bestScore.avoidHits;
  return false;
}

function generatePlacement({ students, rules, constraints = {}, avoid = {}, layout, maxAttempts = 400 }) {
  const validation = validateModel({ students, rules, constraints, avoid, layout });
  if (!validation.ok) return validation;

  const seatById = seatByIdMap(layout);
  const allSeatIds = layout.seats.map((seat) => seat.id);
  const allowedSeatsByStudent = Object.fromEntries(
    students.map((student) => [student, constraints[student] ? [...new Set(constraints[student])] : [...allSeatIds]])
  );
  const rulesByStudent = {};
  rules.forEach((rule) => {
    if (!rulesByStudent[rule.a]) rulesByStudent[rule.a] = [];
    if (!rulesByStudent[rule.b]) rulesByStudent[rule.b] = [];
    rulesByStudent[rule.a].push(rule.b);
    rulesByStudent[rule.b].push(rule.a);
  });

  let bestScore = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const assignedSeatByStudent = {};
    const usedSeatIds = new Set();
    const orderedStudents = shuffled(students).sort((a, b) => allowedSeatsByStudent[a].length - allowedSeatsByStudent[b].length);

    function backtrack(index) {
      if (index === orderedStudents.length) {
        const score = scorePlacement(assignedSeatByStudent, avoid, layout);
        if (isBetterScore(score, bestScore)) {
          bestScore = score;
        }
        return bestScore && bestScore.lonelyRows === 0 && bestScore.avoidHits === 0;
      }

      const student = orderedStudents[index];
      const rawCandidates = allowedSeatsByStudent[student].filter((seatId) => !usedSeatIds.has(seatId));
      const candidates = orderSeatsForStudent(student, rawCandidates, avoid);

      for (const seatId of candidates) {
        const seat = seatById[seatId];
        if (!respectsRuleForAssignment(student, seat, rulesByStudent, assignedSeatByStudent, seatById)) continue;
        assignedSeatByStudent[student] = seatId;
        usedSeatIds.add(seatId);
        if (backtrack(index + 1)) return true;
        delete assignedSeatByStudent[student];
        usedSeatIds.delete(seatId);
      }
      return false;
    }

    if (backtrack(0) && bestScore && bestScore.lonelyRows === 0 && bestScore.avoidHits === 0) {
      return { ok: true, placement: bestScore.placement };
    }
  }

  if (bestScore) {
    return { ok: true, placement: bestScore.placement };
  }

  return { ok: false, error: 'Ingen giltig placering kunde hittas. Kontrollera regler och platsval.' };
}

async function startShuffle() {
  if (state.isShuffling) return;

  const result = generatePlacement({
    students: getPresentStudents(),
    rules: getActiveRules(),
    constraints: getActiveSeatMap(state.constraints),
    avoid: getActiveSeatMap(state.avoid),
    layout: classroomLayout
  });

  setShuffleButtonsState(true);
  showShuffleOverlay();

  await runShuffleSequence({
    onStateChange: (phaseState) => {
      updateShuffleOverlay(phaseState);
      if (phaseState.phase === 'countdown') setStatus(`Slumpar placering om ${phaseState.value}...`, 'busy');
      else if (phaseState.phase === 'loading') setStatus('Bearbetar placering...', 'busy');
    }
  });

  hideShuffleOverlay();
  setShuffleButtonsState(false);

  if (!result.ok) {
    setStatus(result.error, 'error');
    return;
  }

  state.placement = result.placement;
  renderClassroom();
  openMapModal();
  setStatus('Placering klar.', 'ok');
}

function renderStudentList() {
  updateStudentCount();
  els.studentList.innerHTML = '';
  if (state.students.length === 0) {
    appendEmptyState(els.studentList, 'Standardlistan är tom.');
    return;
  }
  state.students.forEach((student) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <div class="item-copy">
        <span class="item-title">${escapeHtml(student)}</span>
        <span class="item-meta">${isPresent(student) ? 'Närvarande och möjlig att placera.' : 'Frånvarande och placeras inte.'}</span>
      </div>
      <div class="panel-actions">
        <button type="button" class="button button-secondary item-action attendance-toggle">${isPresent(student) ? 'Markera frånvarande' : 'Markera närvarande'}</button>
        <button type="button" class="button button-secondary item-action remove-student">Ta bort</button>
      </div>
    `;
    li.querySelector('.attendance-toggle').addEventListener('click', () => setAttendance(student, !isPresent(student)));
    li.querySelector('.remove-student').addEventListener('click', () => removeStudent(student));
    els.studentList.appendChild(li);
  });
}

function renderStudentSelectors() {
  if (!els.ruleStudentA || !els.ruleStudentB || !els.constraintStudent) return;
  const previousValues = {
    ruleA: els.ruleStudentA.value,
    ruleB: els.ruleStudentB.value,
    constraintStudent: els.constraintStudent.value,
    avoidStudent: els.avoidStudent ? els.avoidStudent.value : ''
  };

  const options = ['<option value="">Välj elev</option>', '<option value="__ALL__">Alla elever</option>']
    .concat(state.students.map((student) => `<option value="${escapeHtml(student)}">${escapeHtml(student)}</option>`))
    .join('');

  els.ruleStudentA.innerHTML = options;
  els.ruleStudentB.innerHTML = options;
  els.constraintStudent.innerHTML = options;
  if (els.avoidStudent) els.avoidStudent.innerHTML = options;

  const validStudentOrAll = (value) => value === '__ALL__' || state.students.includes(value);
  els.ruleStudentA.value = validStudentOrAll(previousValues.ruleA) ? previousValues.ruleA : '';
  els.ruleStudentB.value = validStudentOrAll(previousValues.ruleB) ? previousValues.ruleB : '';
  els.constraintStudent.value = validStudentOrAll(previousValues.constraintStudent) ? previousValues.constraintStudent : '';
  if (els.avoidStudent) els.avoidStudent.value = validStudentOrAll(previousValues.avoidStudent) ? previousValues.avoidStudent : '';
}

function buildSeatOptions(selectedSet) {
  return classroomLayout.seats
    .map((seat) => `<option value="${seat.id}" ${selectedSet.has(seat.id) ? 'selected' : ''}>Plats ${seat.id}</option>`)
    .join('');
}

function renderSeatSelectors() {
  if (!els.constraintSeats) return;
  const constraintSelected = new Set(Array.from(els.constraintSeats.selectedOptions).map((option) => option.value));
  const avoidSelected = new Set(Array.from((els.avoidSeats?.selectedOptions || [])).map((option) => option.value));
  els.constraintSeats.innerHTML = buildSeatOptions(constraintSelected);
  if (els.avoidSeats) els.avoidSeats.innerHTML = buildSeatOptions(avoidSelected);
}

function renderRulesList() {
  els.rulesList.innerHTML = '';
  if (state.rules.length === 0) {
    appendEmptyState(els.rulesList, 'Inga regler sparade.');
    return;
  }
  state.rules.forEach((rule) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <div class="item-copy">
        <span class="item-title">${escapeHtml(rule.a)} ⇄ ${escapeHtml(rule.b)}</span>
        <span class="item-meta">Olika block och inte i samma höjd.</span>
      </div>
      <button type="button" class="button button-secondary item-action">Ta bort</button>
    `;
    li.querySelector('button').addEventListener('click', () => removeRule(rule.a, rule.b));
    els.rulesList.appendChild(li);
  });
}

function renderConstraintsList() {
  els.constraintsList.innerHTML = '';
  const entries = Object.entries(state.constraints).sort(([a], [b]) => a.localeCompare(b, 'sv'));
  if (entries.length === 0) {
    appendEmptyState(els.constraintsList, 'Inga tillåtna platser sparade.');
    return;
  }
  entries.forEach(([student, seatIds]) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <div class="item-copy">
        <span class="item-title">${escapeHtml(student)}</span>
        <span class="item-meta">Tillåtna platser (${seatIds.length}): ${seatIds.map((seatId) => escapeHtml(seatId)).join(', ')}</span>
      </div>
      <button type="button" class="button button-secondary item-action">Ta bort</button>
    `;
    li.querySelector('button').addEventListener('click', () => removeConstraint(student));
    els.constraintsList.appendChild(li);
  });
}

function renderAvoidList() {
  if (!els.avoidList) return;
  els.avoidList.innerHTML = '';
  const entries = Object.entries(state.avoid).sort(([a], [b]) => a.localeCompare(b, 'sv'));
  if (entries.length === 0) {
    appendEmptyState(els.avoidList, 'Inga mindre åtråvärda platser sparade.');
    return;
  }
  entries.forEach(([student, seatIds]) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <div class="item-copy">
        <span class="item-title">${escapeHtml(student)}</span>
        <span class="item-meta">Undvik helst: ${seatIds.map((seatId) => escapeHtml(seatId)).join(', ')}</span>
      </div>
      <button type="button" class="button button-secondary item-action">Ta bort</button>
    `;
    li.querySelector('button').addEventListener('click', () => removeAvoidSeats(student));
    els.avoidList.appendChild(li);
  });
}

function renderImportStatus() {
  els.importStatus.textContent = state.importStatus;
}

function createSeatEl(seat) {
  const seatEl = document.createElement('article');
  const student = state.placement[seat.id];
  seatEl.className = `seat${student ? ' seat-filled' : ''}`;
  seatEl.innerHTML = `
    <div class="seat-header-row">
      <span class="seat-number">Plats ${seat.label}</span>
    </div>
    <div class="seat-student ${student ? 'seat-student-filled' : 'seat-student-empty'}">${escapeHtml(student || 'Tom plats')}</div>
  `;
  return seatEl;
}

function renderClassroomInto(sectionToElement) {
  Object.values(sectionToElement).forEach((sectionEl) => {
    sectionEl.innerHTML = '';
  });
  classroomLayout.seats.forEach((seat) => {
    sectionToElement[seat.section].appendChild(createSeatEl(seat));
  });
}

function renderClassroom() {
  renderClassroomInto({
    leftBlock: els.leftBlockGrid,
    middleBlock: els.middleBlockGrid,
    rightBlock: els.rightBlockGrid,
    backRow: els.backRowGrid
  });
}

function mapModalMarkup() {
  return `
    <div class="classroom-layout classroom-layout-modal" aria-label="Placeringskarta i stor ruta">
      <div class="teacher-area">
        <div class="teacher-board">Fram i klassrummet</div>
        <div class="teacher">Lärare</div>
      </div>
      <div class="blocks-row">
        <section class="seat-section">
          <div class="section-header"><h3>Vänster block</h3><span>01–09</span></div>
          <div class="section-grid section-grid-3" data-modal-grid="leftBlock"></div>
        </section>
        <section class="seat-section seat-section-middle">
          <div class="section-header"><h3>Mittenblock</h3><span>10–15</span></div>
          <div class="section-grid section-grid-2" data-modal-grid="middleBlock"></div>
        </section>
        <section class="seat-section">
          <div class="section-header"><h3>Höger block</h3><span>16–24</span></div>
          <div class="section-grid section-grid-3" data-modal-grid="rightBlock"></div>
        </section>
      </div>
      <section class="seat-section back-row">
        <div class="section-header"><h3>Bakre rad</h3><span>25–28</span></div>
        <div class="section-grid section-grid-4" data-modal-grid="backRow"></div>
      </section>
    </div>
  `;
}

function openMapModal() {
  if (!els.mapModalBody || !els.mapModal) return;
  els.mapModalBody.innerHTML = mapModalMarkup();
  const sectionToElement = {
    leftBlock: els.mapModalBody.querySelector('[data-modal-grid="leftBlock"]'),
    middleBlock: els.mapModalBody.querySelector('[data-modal-grid="middleBlock"]'),
    rightBlock: els.mapModalBody.querySelector('[data-modal-grid="rightBlock"]'),
    backRow: els.mapModalBody.querySelector('[data-modal-grid="backRow"]')
  };
  renderClassroomInto(sectionToElement);
  els.mapModal.classList.remove('hidden');
  els.mapModal.setAttribute('aria-hidden', 'false');
}

function closeMapModal() {
  if (!els.mapModal || !els.mapModalBody) return;
  els.mapModal.classList.add('hidden');
  els.mapModal.setAttribute('aria-hidden', 'true');
  els.mapModalBody.innerHTML = '';
}

function render() {
  renderStudentList();
  renderStudentSelectors();
  renderSeatSelectors();
  renderRulesList();
  renderConstraintsList();
  renderAvoidList();
  renderImportStatus();
  renderClassroom();
}

async function importStudentsFromFile() {
  const file = els.importStudentsFile.files?.[0];
  if (!file) {
    state.importStatus = 'Välj en .txt-fil först.';
    renderImportStatus();
    setStatus('Ingen fil vald för import.', 'error');
    return;
  }
  const text = await file.text();
  const names = text.split(/\r?\n/).map(normalizeStudentName).filter(Boolean);
  let added = 0;
  let duplicates = 0;
  const existing = new Set(state.students);
  for (const name of names) {
    if (existing.has(name)) {
      duplicates += 1;
      continue;
    }
    existing.add(name);
    state.students.push(name);
    state.attendance[name] = true;
    added += 1;
  }
  state.students.sort((a, b) => a.localeCompare(b, 'sv'));
  saveAllStateToLocalStorage();
  state.importStatus = `${added} namn importerades${duplicates ? `, ${duplicates} ignorerades som dubbletter` : ''}.`;
  render();
  setStatus('Import till standardlistan klar och sparad lokalt.', 'ok');
}


function exportSettings() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    students: state.students,
    rules: state.rules,
    constraints: state.constraints,
    avoid: state.avoid,
    attendance: state.attendance
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'simons-placeringsgenerator-installningar.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus('Inställningarna har exporterats till en JSON-fil.', 'ok');
}

async function importSettingsFromFile() {
  const file = els.importSettingsFile.files?.[0];
  if (!file) {
    setStatus('Välj en inställningsfil först.', 'error');
    return;
  }
  const parsed = JSON.parse(await file.text());
  if (!parsed || !Array.isArray(parsed.students)) {
    throw new Error('Ogiltig fil');
  }
  state.students = [...new Set(parsed.students.map(normalizeStudentName).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'sv'));
  state.rules = Array.isArray(parsed.rules) ? parsed.rules.filter((rule) => rule && rule.a && rule.b) : [];
  state.constraints = parsed.constraints && typeof parsed.constraints === 'object' ? parsed.constraints : {};
  state.avoid = parsed.avoid && typeof parsed.avoid === 'object' ? parsed.avoid : {};
  state.attendance = parsed.attendance && typeof parsed.attendance === 'object' ? parsed.attendance : {};
  ensureAttendanceState();
  state.placement = {};
  saveAllStateToLocalStorage();
  render();
  setStatus('Inställningarna har importerats.', 'ok');
}

els.addStudentForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  addStudent(els.newStudentName.value);
  els.newStudentName.value = '';
});

els.saveStudentsBtn?.addEventListener('click', saveStudents);
els.importStudentsBtn?.addEventListener('click', () => {
  importStudentsFromFile().catch(() => {
    state.importStatus = 'Importen misslyckades. Kontrollera att filen är en läsbar .txt-fil.';
    renderImportStatus();
    setStatus('Importen misslyckades.', 'error');
  });
});
els.exportSettingsBtn?.addEventListener('click', exportSettings);
els.importSettingsBtn?.addEventListener('click', () => {
  importSettingsFromFile().catch(() => {
    setStatus('Import av inställningar misslyckades.', 'error');
  });
});

els.addRuleForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  addRule(els.ruleStudentA.value, els.ruleStudentB.value);
});

els.setConstraintForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedSeatIds = Array.from(els.constraintSeats.selectedOptions).map((option) => option.value);
  setConstraint(els.constraintStudent.value, selectedSeatIds);
});

els.setAvoidForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedSeatIds = Array.from(els.avoidSeats.selectedOptions).map((option) => option.value);
  setAvoidSeats(els.avoidStudent.value, selectedSeatIds);
});

els.saveRulesBtn?.addEventListener('click', saveRulesAndConstraints);
els.shuffleBtn?.addEventListener('click', startShuffle);
els.clearPlacementBtn?.addEventListener('click', clearPlacement);
els.closeMapModalBtn?.addEventListener('click', closeMapModal);
els.mapModal?.addEventListener('click', (event) => {
  if (event.target === els.mapModal) closeMapModal();
});

ensureAttendanceState();
render();
if (!hasUniqueSeatIds(classroomLayout)) {
  setStatus('Fel i layout: platsnummer måste vara unika.', 'error');
} else {
  setStatus('Klar. Appen är initierad och klassrumsstrukturen är låst enligt den fastställda platslogiken.', 'ok');
}

window.__appTestApi = {
  getState: () => JSON.parse(JSON.stringify(state)),
  addStudent,
  removeStudent,
  addRule,
  removeRule,
  setConstraint,
  removeConstraint,
  setAvoidSeats,
  removeAvoidSeats,
  clearPlacement,
  startShuffle,
  importStudentsFromFile,
  saveStudents,
  saveRulesAndConstraints,
  setAttendance,
  getPresentStudents,
  exportSettings,
  importSettingsFromFile,
  validateModel: (model) => validateModel(model),
  generatePlacement: (model) => generatePlacement(model),
  closeMapModal,
  classroomLayout,
  STORAGE_KEYS
};
