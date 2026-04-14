import { classroomLayout } from './classroom-layout.js';
import { generatePlacement, hasUniqueSeatIds } from './core.js';
import { runShuffleSequence } from './sequence.js';

const STORAGE_KEYS = {
  students: 'klassrum.standardlista.v1',
  rules: 'klassrum.regler.v1',
  constraints: 'klassrum.platsbegransningar.v1'
};

const DEFAULT_STUDENTS = ['Anna', 'Bo', 'Cecilia', 'David', 'Elin', 'Farid', 'Greta', 'Hasan'];

const state = {
  students: loadList(STORAGE_KEYS.students, DEFAULT_STUDENTS),
  rules: loadList(STORAGE_KEYS.rules, []),
  constraints: loadObject(STORAGE_KEYS.constraints, {}),
  placement: {},
  isShuffling: false
};

const els = {
  studentList: document.getElementById('student-list'),
  addStudentForm: document.getElementById('add-student-form'),
  newStudentName: document.getElementById('new-student-name'),
  saveStudentsBtn: document.getElementById('save-students-btn'),

  ruleStudentA: document.getElementById('rule-student-a'),
  ruleStudentB: document.getElementById('rule-student-b'),
  addRuleForm: document.getElementById('add-rule-form'),
  rulesList: document.getElementById('rules-list'),

  constraintStudent: document.getElementById('constraint-student'),
  constraintSeats: document.getElementById('constraint-seats'),
  setConstraintForm: document.getElementById('set-constraint-form'),
  constraintsList: document.getElementById('constraints-list'),

  saveRulesBtn: document.getElementById('save-rules-btn'),

  classroomStatus: document.getElementById('classroom-status'),
  leftBlockGrid: document.getElementById('left-block-grid'),
  middleBlockGrid: document.getElementById('middle-block-grid'),
  rightBlockGrid: document.getElementById('right-block-grid'),
  backRowGrid: document.getElementById('back-row-grid'),

  shuffleBtn: document.getElementById('shuffle-btn'),
  clearPlacementBtn: document.getElementById('clear-placement-btn')
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

function setStatus(message, type = '') {
  els.classroomStatus.innerHTML = message;
  els.classroomStatus.className = `status ${type}`.trim();
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(state.students));
  setStatus('Standardlistan har sparats lokalt.', 'ok');
}

function saveRulesAndConstraints() {
  localStorage.setItem(STORAGE_KEYS.rules, JSON.stringify(state.rules));
  localStorage.setItem(STORAGE_KEYS.constraints, JSON.stringify(state.constraints));
  setStatus('Regler och platsbegränsningar har sparats lokalt.', 'ok');
}

function addStudent(name) {
  const clean = name.trim();
  if (!clean) return;
  if (state.students.includes(clean)) {
    setStatus(`Eleven "${clean}" finns redan.`, 'error');
    return;
  }
  state.students.push(clean);
  render();
}

function removeStudent(name) {
  state.students = state.students.filter((student) => student !== name);
  state.rules = state.rules.filter((rule) => rule.a !== name && rule.b !== name);
  delete state.constraints[name];
  render();
}

function addRule(a, b) {
  if (!a || !b || a === b) {
    setStatus('Sidregel kräver två olika elever.', 'error');
    return;
  }

  const exists = state.rules.some((rule) => (rule.a === a && rule.b === b) || (rule.a === b && rule.b === a));
  if (exists) {
    setStatus('Sidregeln finns redan.', 'error');
    return;
  }

  state.rules.push({ a, b });
  render();
}

function removeRule(a, b) {
  state.rules = state.rules.filter((rule) => !(rule.a === a && rule.b === b));
  render();
}

function setConstraint(student, seatIds) {
  if (!student) {
    setStatus('Välj elev för platsbegränsning.', 'error');
    return;
  }

  if (seatIds.length === 0) {
    setStatus('En elev med platsbegränsning måste ha minst ett platsnummer.', 'error');
    return;
  }

  state.constraints[student] = [...new Set(seatIds.map((seatId) => String(seatId)))].sort();
  render();
}

function removeConstraint(student) {
  delete state.constraints[student];
  render();
}

function clearPlacement() {
  state.placement = {};
  renderClassroom();
  setStatus('Aktuell placering rensad. Sparad lista/regler/begränsningar är oförändrade.', 'ok');
}

function setShuffleButtonsState(isBusy) {
  state.isShuffling = isBusy;
  els.shuffleBtn.disabled = isBusy;
}

async function startShuffle() {
  if (state.isShuffling) {
    return;
  }

  const result = generatePlacement({
    students: state.students,
    rules: state.rules,
    constraints: state.constraints,
    layout: classroomLayout
  });

  setShuffleButtonsState(true);

  await runShuffleSequence({
    onStateChange: (phaseState) => {
      if (phaseState.phase === 'countdown') {
        setStatus(`Slumpar placering om ${phaseState.value}...`, 'busy');
      } else if (phaseState.phase === 'loading') {
        setStatus('<span class="spinner"></span>Bearbetar placering...', 'busy');
      }
    }
  });

  setShuffleButtonsState(false);

  if (!result.ok) {
    setStatus(result.error, 'error');
    return;
  }

  state.placement = result.placement;
  renderClassroom();
  setStatus('Placering klar.', 'ok');
}

function renderStudentList() {
  els.studentList.innerHTML = '';
  state.students.forEach((student) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `<span>${student}</span><button type="button">Ta bort elev</button>`;
    li.querySelector('button').addEventListener('click', () => removeStudent(student));
    els.studentList.appendChild(li);
  });
}

function renderStudentSelectors() {
  const options = ['<option value="">Välj elev</option>']
    .concat(state.students.map((student) => `<option value="${student}">${student}</option>`))
    .join('');

  els.ruleStudentA.innerHTML = options;
  els.ruleStudentB.innerHTML = options;
  els.constraintStudent.innerHTML = options;
}

function renderConstraintSeatSelector() {
  const seatOptions = classroomLayout.seats
    .map((seat) => `<option value="${seat.id}">${seat.id} (${seat.zone})</option>`)
    .join('');
  els.constraintSeats.innerHTML = seatOptions;
}

function renderRulesList() {
  els.rulesList.innerHTML = '';
  state.rules.forEach((rule) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `<span>${rule.a} ⇄ ${rule.b} (motsatta sidor)</span><button type="button">Ta bort regel</button>`;
    li.querySelector('button').addEventListener('click', () => removeRule(rule.a, rule.b));
    els.rulesList.appendChild(li);
  });
}

function renderConstraintsList() {
  els.constraintsList.innerHTML = '';
  Object.entries(state.constraints)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([student, seatIds]) => {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.innerHTML = `<span>${student}: ${seatIds.join(', ')}</span><button type="button">Ta bort begränsning</button>`;
      li.querySelector('button').addEventListener('click', () => removeConstraint(student));
      els.constraintsList.appendChild(li);
    });
}

function createSeatEl(seat) {
  const seatEl = document.createElement('article');
  seatEl.className = 'seat';
  const student = state.placement[seat.id] || '— tom plats —';
  seatEl.innerHTML = `<span class="seat-label">Plats ${seat.label}</span><div class="seat-student">${student}</div>`;
  return seatEl;
}

function renderClassroom() {
  const sectionToElement = {
    leftBlock: els.leftBlockGrid,
    middleBlock: els.middleBlockGrid,
    rightBlock: els.rightBlockGrid,
    backRow: els.backRowGrid
  };

  Object.values(sectionToElement).forEach((sectionEl) => {
    sectionEl.innerHTML = '';
  });

  classroomLayout.seats.forEach((seat) => {
    sectionToElement[seat.section].appendChild(createSeatEl(seat));
  });
}

function render() {
  renderStudentList();
  renderStudentSelectors();
  renderConstraintSeatSelector();
  renderRulesList();
  renderConstraintsList();
  renderClassroom();
}

els.addStudentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addStudent(els.newStudentName.value);
  els.newStudentName.value = '';
});

els.saveStudentsBtn.addEventListener('click', saveStudents);

els.addRuleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addRule(els.ruleStudentA.value, els.ruleStudentB.value);
});

els.setConstraintForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedSeatIds = Array.from(els.constraintSeats.selectedOptions).map((option) => option.value);
  setConstraint(els.constraintStudent.value, selectedSeatIds);
});

els.saveRulesBtn.addEventListener('click', saveRulesAndConstraints);
els.shuffleBtn.addEventListener('click', startShuffle);
els.clearPlacementBtn.addEventListener('click', clearPlacement);

render();
if (!hasUniqueSeatIds(classroomLayout)) {
  setStatus('Fel i layout: platsnummer måste vara unika.', 'error');
} else {
  setStatus('Klar. Fram i klassrummet visas överst och lärarplats är centrerad.', 'ok');
}
