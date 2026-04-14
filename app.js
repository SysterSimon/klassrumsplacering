import { classroomLayout } from './classroom-layout.js';
import { generatePlacement, validateRules } from './core.js';

const STORAGE_KEYS = {
  students: 'klassrum.standardlista.v1',
  rules: 'klassrum.regler.v1'
};

const DEFAULT_STUDENTS = ['Anna', 'Bo', 'Cecilia', 'David', 'Elin', 'Farid', 'Greta', 'Hasan'];

const state = {
  students: loadList(STORAGE_KEYS.students, DEFAULT_STUDENTS),
  rules: loadList(STORAGE_KEYS.rules, []),
  placement: {}
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
  saveRulesBtn: document.getElementById('save-rules-btn'),
  classroomStatus: document.getElementById('classroom-status'),
  classroomGrid: document.getElementById('classroom-grid'),
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

function saveStudents() {
  localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(state.students));
  setStatus('Standardlistan har sparats lokalt.', 'ok');
}

function saveRules() {
  localStorage.setItem(STORAGE_KEYS.rules, JSON.stringify(state.rules));
  setStatus('Reglerna har sparats lokalt.', 'ok');
}

function setStatus(message, type = '') {
  els.classroomStatus.textContent = message;
  els.classroomStatus.className = `status ${type}`.trim();
}

function removeStudent(name) {
  state.students = state.students.filter((student) => student !== name);
  state.rules = state.rules.filter((rule) => rule.a !== name && rule.b !== name);
  render();
}

function addStudent(name) {
  const clean = name.trim();
  if (!clean) return;
  if (state.students.includes(clean)) {
    setStatus(`Eleven "${clean}" finns redan i standardlistan.`, 'error');
    return;
  }
  state.students.push(clean);
  render();
}

function addRule(a, b) {
  if (!a || !b || a === b) {
    setStatus('Regel kräver två olika elever.', 'error');
    return;
  }
  const exists = state.rules.some((rule) => (rule.a === a && rule.b === b) || (rule.a === b && rule.b === a));
  if (exists) {
    setStatus('Regeln finns redan.', 'error');
    return;
  }
  state.rules.push({ a, b });
  render();
}

function removeRule(a, b) {
  state.rules = state.rules.filter((rule) => !(rule.a === a && rule.b === b));
  render();
}

function clearPlacement() {
  state.placement = {};
  renderClassroom();
  setStatus('Aktuell placering är rensad. Standardlista och regler är oförändrade.', 'ok');
}

function randomizePlacement() {
  if (!validateRules(state.students, state.rules)) {
    setStatus('En eller flera regler är ogiltiga. Kontrollera elevlistan och reglerna.', 'error');
    return;
  }

  const result = generatePlacement({
    students: state.students,
    rules: state.rules,
    layout: classroomLayout
  });

  if (!result.ok) {
    setStatus(result.error, 'error');
    return;
  }

  state.placement = result.placement;
  renderClassroom();
  setStatus('Ny slumpad placering skapad.', 'ok');
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

function renderRuleSelectors() {
  const options = ['<option value="">Välj elev</option>']
    .concat(state.students.map((student) => `<option value="${student}">${student}</option>`))
    .join('');

  els.ruleStudentA.innerHTML = options;
  els.ruleStudentB.innerHTML = options;
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

function renderClassroom() {
  els.classroomGrid.innerHTML = '';

  classroomLayout.seats.forEach((seat) => {
    const seatEl = document.createElement('article');
    seatEl.className = 'seat';
    seatEl.style.gridRow = String(seat.row);
    seatEl.style.gridColumn = String(seat.col);

    const student = state.placement[seat.id] || '— tom plats —';
    seatEl.innerHTML = `
      <span class="seat-label">Plats ${seat.label}</span>
      <span class="seat-zone">Zon: ${seat.zone}</span>
      <div class="seat-student">${student}</div>
    `;

    els.classroomGrid.appendChild(seatEl);
  });
}

function render() {
  renderStudentList();
  renderRuleSelectors();
  renderRulesList();
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
els.saveRulesBtn.addEventListener('click', saveRules);
els.shuffleBtn.addEventListener('click', randomizePlacement);
els.clearPlacementBtn.addEventListener('click', clearPlacement);

render();
setStatus(
  'Just nu används en placeholder-layout. Ersätt classroom-layout.js med den faktiska skissen innan skarp användning.',
  'error'
);
