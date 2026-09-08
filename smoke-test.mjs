import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

class FakeClassList {
  constructor() { this.set = new Set(); }
  add(...names) { names.forEach((n) => this.set.add(n)); }
  remove(...names) { names.forEach((n) => this.set.delete(n)); }
  contains(name) { return this.set.has(name); }
}

class FakeElement {
  constructor(id = '', tagName = 'div') {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this._innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.disabled = false;
    this.files = [];
    this.attributes = {};
    this.listeners = {};
    this.className = '';
    this.classList = new FakeClassList();
  }
  set innerHTML(value) {
    this._innerHTML = String(value);
    this.children = [];
    const classMatches = [...this._innerHTML.matchAll(/class="([^"]+)"/g)];
    classMatches.forEach((m) => {
      const child = new FakeElement('', 'div');
      child.className = m[1];
      child._classes = new Set(m[1].split(/\s+/));
      if (child._classes.has('attendance-toggle') || child._classes.has('remove-student') || child.tagName === 'BUTTON') {
        child.tagName = 'BUTTON';
      }
      this.children.push(child);
    });
    if (this._innerHTML.includes('<button')) {
      const button = new FakeElement('', 'button');
      this.children.push(button);
    }
    if (this.tagName === 'SELECT') {
      this._options = [...this._innerHTML.matchAll(/<option value="([^"]*)"([^>]*)>/g)].map((m) => ({
        value: m[1],
        selected: /selected/.test(m[2])
      }));
    }
  }
  get innerHTML() { return this._innerHTML; }
  get selectedOptions() { return (this._options || []).filter((o) => o.selected); }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  appendChild(child) { this.children.push(child); return child; }
  remove() {}
  click() {}
  querySelector(selector) {
    if (selector === 'button') return this.children.find((child) => child.tagName === 'BUTTON') || null;
    if (selector === '.empty-state') {
      if (!this._emptyState) this._emptyState = new FakeElement('', 'li');
      return this._emptyState;
    }
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      return this.children.find((child) => child._classes && child._classes.has(cls)) || null;
    }
    if (selector.startsWith('[data-modal-grid=')) return new FakeElement('', 'div');
    return null;
  }
  setAttribute(name, value) { this.attributes[name] = value; }
}

const ids = [
  'student-list','student-count-text','attendance-count-text','add-student-form','new-student-name','save-students-btn','import-students-file','import-students-btn','import-status',
  'export-settings-btn','import-settings-file','import-settings-btn',
  'rule-student-a','rule-student-b','add-rule-form','rules-list','constraint-student','constraint-seats','set-constraint-form','constraints-list',
  'avoid-student','avoid-seats','set-avoid-form','avoid-list',
  'save-rules-btn','classroom-status','classroom-layout','left-block-grid','middle-block-grid','right-block-grid','back-row-grid','shuffle-btn','clear-placement-btn',
  'shuffle-overlay','shuffle-overlay-body','map-modal','map-modal-body','close-map-modal-btn','empty-list-template'
];
const elements = Object.fromEntries(ids.map((id) => [id, new FakeElement(id, 'div')]));
['add-student-form','add-rule-form','set-constraint-form','set-avoid-form'].forEach((id) => elements[id] = new FakeElement(id, 'form'));
['rule-student-a','rule-student-b','constraint-student','constraint-seats','avoid-student','avoid-seats'].forEach((id) => elements[id] = new FakeElement(id, 'select'));
['new-student-name','import-students-file','import-settings-file'].forEach((id) => elements[id] = new FakeElement(id, 'input'));

elements['empty-list-template'].content = {
  cloneNode() {
    return {
      _emptyState: new FakeElement('', 'li'),
      querySelector(selector) { return selector === '.empty-state' ? this._emptyState : null; }
    };
  }
};

const localStore = new Map();
const context = {
  console,
  setTimeout: (fn) => { fn(); return 0; },
  clearTimeout: () => {},
  Blob,
  URL: { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} },
  localStorage: {
    getItem: (key) => localStore.has(key) ? localStore.get(key) : null,
    setItem: (key, value) => localStore.set(key, String(value)),
    removeItem: (key) => localStore.delete(key)
  },
  document: {
    getElementById: (id) => elements[id] || null,
    createElement: (tag) => new FakeElement('', tag),
    body: new FakeElement('body', 'body')
  },
  window: {}
};
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync('./app.js', 'utf8'), context);

const api = context.window.__appTestApi;
assert.ok(api);
assert.equal(api.getState().students.length >= 1, true);

assert.equal(api.addStudent('Zelda'), true);
assert.equal(api.getState().students.includes('Zelda'), true);
api.setAttendance('Zelda', false);
assert.equal(api.getPresentStudents().includes('Zelda'), false);
api.setAttendance('Zelda', true);
assert.equal(api.getPresentStudents().includes('Zelda'), true);
api.removeStudent('Zelda');
assert.equal(api.getState().students.includes('Zelda'), false);

api.addRule('__ALL__', 'Anna');
assert.equal(api.getState().rules.length >= 1, true);
api.removeRule('Anna', 'Bo');

api.setConstraint('__ALL__', ['01', '02']);
assert.deepEqual(Array.from(api.getState().constraints.Anna), ['01', '02']);
api.setAvoidSeats('__ALL__', ['24']);
assert.deepEqual(Array.from(api.getState().avoid.Anna), ['24']);
api.removeConstraint('Anna');
api.removeAvoidSeats('Anna');

const placementResult = api.generatePlacement({
  students: ['Anna', 'Bo'],
  rules: [{ a: 'Anna', b: 'Bo' }],
  constraints: { Anna: ['01', '02'], Bo: ['20', '21'] },
  layout: api.classroomLayout
});
assert.equal(placementResult.ok, true);

elements['import-settings-file'].files = [{ async text() { return JSON.stringify({ students: ['Anna','Bo','Cecilia'], rules: [], constraints: {}, avoid: {}, attendance: { Anna: true, Bo: true, Cecilia: true } }); } }];
await api.importSettingsFromFile();
await api.startShuffle();
assert.equal(Object.keys(api.getState().placement).length > 0, true);
api.clearPlacement();
assert.equal(Object.keys(api.getState().placement).length, 0);

const fakeFile = { async text() { return 'Ada\nBo\n\nAda\nLisa'; } };
elements['import-students-file'].files = [fakeFile];
await api.importStudentsFromFile();
const afterImport = api.getState();
assert.equal(afterImport.students.includes('Ada'), true);
assert.equal(afterImport.students.includes('Lisa'), true);
assert.equal(afterImport.students.filter((n) => n === 'Ada').length, 1);
assert.equal(localStore.has(api.STORAGE_KEYS.students), true);

const settingsFile = {
  async text() {
    return JSON.stringify({
      students: ['Kalle', 'Pelle'],
      rules: [{ a: 'Kalle', b: 'Pelle' }],
      constraints: { Kalle: ['01', '02'] },
      avoid: { Pelle: ['24'] },
      attendance: { Kalle: true, Pelle: false }
    });
  }
};
elements['import-settings-file'].files = [settingsFile];
await api.importSettingsFromFile();
const imported = api.getState();
assert.equal(JSON.stringify(imported.students), JSON.stringify(['Kalle', 'Pelle']));
assert.equal(imported.attendance.Pelle, false);

console.log('smoke test passed');
