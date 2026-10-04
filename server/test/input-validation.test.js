// Black-box tests for input validation: request bodies, path and query parameters, and uploads.
//
// Run against a live backend (Node or PHP) on the disposable tilmid_test database. Each invalid
// case must be refused with 400 VALIDATION_FAILED (or the upload rule's own status), and the
// valid case must get past validation. Login rate limits are not exercised here, so run this on a
// fresh server, or after the rate-limit suite has been reset.
//
//   API_BASE=http://127.0.0.1:5010/api DB_PORT=3307 DB_NAME=tilmid_test npm run test:validation

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mysql = require(path.join(__dirname, '..', 'node_modules', 'mysql2', 'promise'));
const bcrypt = require(path.join(__dirname, '..', 'node_modules', 'bcrypt'));

const BASE = process.env.API_BASE || 'http://127.0.0.1:5010/api';
const DB = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tilmid_test',
};
if (DB.database !== 'tilmid_test') {
  throw new Error(`Refusing to run: this suite writes test data. Use DB_NAME=tilmid_test (got ${DB.database}).`);
}
const pool = mysql.createPool({ ...DB, connectionLimit: 2 });

// Where the backend writes uploads (run from server/); the suite deletes what it creates.
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads');

const PW = { admin: crypto.randomBytes(12).toString('base64url'), student: crypto.randomBytes(12).toString('base64url') };
const ids = {};

async function call(method, route, { token, body, form } = {}) {
  const headers = {};
  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${route}`, { method, headers, body: payload });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not JSON */ }
  return { status: res.status, json, text };
}

function assertInvalid(res, field, label) {
  assert.equal(res.status, 400, `${label}: expected 400, got ${res.status} ${res.text}`);
  assert.equal(res.json?.code, 'VALIDATION_FAILED', `${label}: missing VALIDATION_FAILED code`);
  if (field) {
    assert.ok(res.json.errors.some((e) => e.field === field), `${label}: no error reported for "${field}"`);
  }
}

before(async () => {
  const conn = await pool.getConnection();
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of ['users', 'students', 'goals', 'checkins', 'coaches', 'appointments', 'feedback', 'collective_sessions', 'tool_options', 'login_attempts', 'rate_limit_events']) {
      await conn.query(`TRUNCATE TABLE ${t}`);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    const [a] = await conn.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ('val-admin', 'val-admin@example.test', ?, 'admin')",
      [bcrypt.hashSync(PW.admin, 4)]);
    ids.admin = a.insertId;
    const [s] = await conn.query(
      "INSERT INTO students (name, username, email, password_hash, status, package) VALUES ('Val Student', 'val-stu', 'val-stu@example.test', ?, 'active', 'boost')",
      [bcrypt.hashSync(PW.student, 4)]);
    ids.student = s.insertId;
    const [g] = await conn.query("INSERT INTO goals (student_id, title) VALUES (?, 'Mine')", [ids.student]);
    ids.goal = g.insertId;
  } finally {
    conn.release();
  }
  const adminLogin = await call('POST', '/auth/login', { body: { email: 'val-admin@example.test', password: PW.admin } });
  assert.equal(adminLogin.status, 200, adminLogin.text);
  ids.adminToken = adminLogin.json.token;
  const studentLogin = await call('POST', '/students/login', { body: { username: 'val-stu', password: PW.student } });
  assert.equal(studentLogin.status, 200, studentLogin.text);
  ids.studentToken = studentLogin.json.token;
});

after(async () => {
  await pool.end();
});

/* ---------------- Strict bodies: one invalid case per rule family ---------------- */

const adminOnly = (f) => ({ ...f, token: () => ids.adminToken });
const studentOnly = (f) => ({ ...f, token: () => ids.studentToken });

const BODY_CASES = [
  // [label, method, path, auth, invalid body, field that must be reported]
  ['login: non-string email', 'POST', '/auth/login', null, { email: { $ne: null }, password: 'x' }, 'email'],
  ['student login: numeric username', 'POST', '/students/login', null, { username: 12345, password: 'x' }, 'username'],
  ['register: short password', 'POST', '/auth/register', null, { username: 'valid', email: 'v@example.test', password: 'short' }, 'password'],
  ['register: bad email', 'POST', '/auth/register', null, { username: 'valid', email: 'not-an-email', password: 'Password123' }, 'email'],
  ['settings: bad contact email', 'POST', '/settings', adminOnly, { contactEmail: 'nope' }, 'contactEmail'],
  ['settings: javascript: URL', 'POST', '/settings', adminOnly, { instagramUrl: 'javascript:alert(1)' }, 'instagramUrl'],
  ['users: unknown role', 'POST', '/users', adminOnly, { username: 'x', email: 'x@example.test', role: 'superadmin' }, 'role'],
  ['students: unknown package', 'POST', '/students', adminOnly, { name: 'x', username: 'x', package: 'gold' }, 'package'],
  ['students: status out of range', 'POST', '/students', adminOnly, { name: 'x', username: 'x', status: 'deleted' }, 'status'],
  ['posts: unknown content type', 'POST', '/posts', adminOnly, { title: 'x', content_type: 'script' }, 'content_type'],
  ['posts: title too long', 'POST', '/posts', adminOnly, { title: 'x'.repeat(256) }, 'title'],
  ['notifications: message with control char', 'POST', '/notifications', adminOnly, { title: 'x', message: 'bad\u0007char', target: { all: true } }, 'message'],
  ['notifications: target not an object', 'POST', '/notifications', adminOnly, { title: 'x', message: 'y', target: 'all' }, 'target'],
  ['tool option: unknown category', 'POST', '/tool-options', adminOnly, { category: 'sport', label: 'x' }, 'category'],
  ['coaches: missing name', 'POST', '/coaches', adminOnly, { email: 'c@example.test' }, 'name'],
  ['coaches: phone with letters', 'POST', '/coaches', adminOnly, { name: 'c', phone: 'call-me-now' }, 'phone'],
  ['appointments: bad date', 'POST', '/appointments', adminOnly, { title: 'x', date: '2026-13-45' }, 'date'],
  ['appointments: unknown status', 'POST', '/appointments', adminOnly, { status: 'maybe' }, 'status'],
  ['stories: story too long', 'POST', '/stories', adminOnly, { storyText: 'x'.repeat(2001) }, 'storyText'],
  ['messages: missing phone', 'POST', '/messages', null, { name: 'Visiteur', message: 'hi' }, 'phone'],
  ['messages: message too long', 'POST', '/messages', null, { name: 'Visiteur', phone: '0600000001', message: 'x'.repeat(2001) }, 'message'],
  ['coaching request: bad phone', 'POST', '/coaching-requests', null, { name: 'V', phone: 'abc', grade: 'Bac' }, 'phone'],
  ['orientation request: missing city', 'POST', '/orientation-requests', null, { name: 'V', phone: '0600000002', filiere: 'x', schoolType: 'x', bacYear: '2026', pack: 'x' }, 'city'],
  ['plan: too many actions', 'POST', '/plan', studentOnly, { actions: Array.from({ length: 101 }, (_, i) => ({ id: String(i) })) }, 'actions'],
  ['plan: action without id', 'POST', '/plan', studentOnly, { actions: [{ text: 'no id' }] }, 'actions'],
  ['plan progress: done not boolean', 'POST', '/plan/progress', studentOnly, { actions: [{ id: '1', done: 'yes' }] }, 'actions'],
  ['goals: unknown status', 'POST', '/goals', studentOnly, { title: 'x', status: 'fini' }, 'status'],
  ['goals: progress over 100', 'POST', '/goals', studentOnly, { title: 'x', progress: 101 }, 'progress'],
  ['revisions: understanding out of range', 'POST', '/revisions', studentOnly, { subject: 'Maths', understanding: 9 }, 'understanding'],
  ['habits: days not seven booleans', 'POST', '/habits', studentOnly, { name: 'Lire', days: [true, false] }, 'days'],
  ['checkins: adherence out of range', 'POST', '/checkins', studentOnly, { adherence: 11, daysRespected: 3, concentration: 3 }, 'adherence'],
  ['checkins: needsAdjustment as string', 'POST', '/checkins', studentOnly, { adherence: 5, daysRespected: 3, concentration: 3, needsAdjustment: 'yes' }, 'needsAdjustment'],
  ['timetable: unknown day', 'POST', '/timetable', studentOnly, { subject: 'Maths', day: 'Funday' }, 'day'],
  ['timetable: bad time', 'POST', '/timetable', studentOnly, { subject: 'Maths', startTime: '25:00' }, 'startTime'],
  ['resources: unknown type', 'POST', '/resources', adminOnly, { title: 'x', type: 'script' }, 'type'],
  ['resources: javascript URL', 'POST', '/resources', adminOnly, { title: 'x', url: 'javascript:alert(1)' }, 'url'],
  ['course module video: unknown source', 'POST', '/course-modules/1', adminOnly, { videoUrl: 'https://videos.example.test/a.mp4', videoSource: 'ftp' }, 'videoSource'],
  ['course module: missing title', 'POST', '/course-modules', adminOnly, { description: 'x' }, 'title'],
  ['course progress: negative seconds', 'POST', '/course-modules/1/progress', studentOnly, { watchedSeconds: -5, durationSeconds: 10 }, 'watchedSeconds'],
  ['feedback: studentId not a number', 'POST', '/feedback', adminOnly, { studentId: 'abc', message: 'x' }, 'studentId'],
  ['feedback: empty message', 'POST', '/feedback', adminOnly, { studentId: 1, message: '   ' }, 'message'],
  ['admin plan: no actions', 'POST', '/admin/plans/1', adminOnly, { objective: 'x', actions: [] }, 'actions'],
  ['collective session: bad date', 'POST', '/collective-sessions', adminOnly, { title: 'x', date: '01/02/2026', time: '18:00' }, 'date'],
  ['collective session: javascript meeting link', 'POST', '/collective-sessions', adminOnly, { title: 'x', date: '2026-02-01', time: '18:00', meetingLink: 'javascript:void(0)' }, 'meetingLink'],
  ['attendance: missing studentId', 'POST', '/collective-sessions/1/attendance', adminOnly, { attended: true }, 'studentId'],
];

describe('request bodies are validated against a strict schema', () => {
  for (const [label, method, route, auth, body, field] of BODY_CASES) {
    it(`${label} is refused with 400 VALIDATION_FAILED`, async () => {
      const token = auth ? auth().token() : undefined;
      const res = await call(method, route, { token, body });
      assertInvalid(res, field, label);
    });
  }
});

describe('valid bodies get past validation', () => {
  it('a goal with an unknown extra field is accepted and the extra field is ignored', async () => {
    const res = await call('POST', '/goals', { token: ids.studentToken, body: { title: 'Réviser', status: 'en_cours', isAdmin: true, role: 'admin' } });
    assert.equal(res.status, 201, res.text);
    const [rows] = await pool.query('SELECT student_id FROM goals WHERE id = ?', [res.json.id]);
    assert.equal(rows[0].student_id, ids.student);
  });

  it('a message from a visitor is accepted', async () => {
    const res = await call('POST', '/messages', { body: { name: 'Visiteur', phone: '+212 600-000 003', message: 'Bonjour' } });
    assert.equal(res.status, 201, res.text);
  });

  it('a password change by an admin that meets the rules is accepted', async () => {
    const res = await call('POST', '/users', { token: ids.adminToken, body: { username: 'val-new', email: 'val-new@example.test', password: 'Password123', role: 'user' } });
    assert.equal(res.status, 201, res.text);
  });
});

// Node answers a malformed id with 400 VALIDATION_FAILED. PHP's routes only match digit ids, so the same
// request is refused with 404 before any handler runs. Either way it must not succeed.
function assertRefusedId(res, label) {
  assert.ok(res.status === 400 || res.status === 404, `${label}: expected a refusal, got ${res.status}`);
  assert.ok(res.status !== 200 && res.status !== 201, `${label}: request was accepted`);
}

describe('path and query parameters are validated', () => {
  it('a non-numeric path id is refused before the handler runs', async () => {
    const res = await call('DELETE', '/goals/abc', { token: ids.studentToken });
    assertRefusedId(res, 'goals/abc');
  });

  it('a zero or negative path id is refused', async () => {
    assertRefusedId(await call('DELETE', '/goals/0', { token: ids.studentToken }), 'goals/0');
    assertRefusedId(await call('DELETE', '/goals/-3', { token: ids.studentToken }), 'goals/-3');
  });

  it('SQL-looking path ids are refused', async () => {
    const res = await call('DELETE', `/goals/${encodeURIComponent("1 OR 1=1")}`, { token: ids.studentToken });
    assertRefusedId(res, 'SQL-looking id');
  });

  it('a non-numeric ?studentId is refused on staff-readable routes', async () => {
    const res = await call('GET', '/goals?studentId=abc', { token: ids.adminToken });
    assert.equal(res.status, 400);
    assert.equal(res.json?.code, 'VALIDATION_FAILED');
  });

  it('a numeric ?studentId still works for admins', async () => {
    const res = await call('GET', `/goals?studentId=${ids.student}`, { token: ids.adminToken });
    assert.equal(res.status, 200, res.text);
  });
});

/* ---------------- Uploads: type, content and size ---------------- */

function upload(name, bytes, { kind, token = ids.adminToken, type = 'application/octet-stream' } = {}) {
  const form = new FormData();
  form.append('file', new Blob([bytes], { type }), name);
  return call('POST', `/upload${kind ? `?kind=${kind}` : ''}`, { token, form });
}

const created = [];
function trackUpload(res) {
  if (res.status === 201 && res.json?.url) created.push(path.join(UPLOAD_ROOT, res.json.url.replace('/api/uploads/', '')));
  return res;
}

const PDF = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(64, 0x20)]);
const MP4 = Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypmp42'), Buffer.alloc(64, 0)]);
const WEBM = Buffer.concat([Buffer.from([0x1a, 0x45, 0xdf, 0xa3]), Buffer.alloc(64, 0)]);
const DOCX = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(64, 0)]);

describe('uploads: only the declared content type, only within the size cap', () => {
  after(() => {
    for (const file of created) fs.rmSync(file, { force: true });
  });

  it('a real PDF is accepted as a document', async () => {
    const res = trackUpload(await upload('fiche.pdf', PDF, { kind: 'document' }));
    assert.equal(res.status, 201, res.text);
  });

  it('a real DOCX (zip container) is accepted as a document', async () => {
    const res = trackUpload(await upload('notes.docx', DOCX, { kind: 'document' }));
    assert.equal(res.status, 201, res.text);
  });

  it('a text file renamed to .pdf is refused (content does not match extension)', async () => {
    const res = await upload('script.pdf', Buffer.from('<?php echo "pwned";'), { kind: 'document' });
    assert.equal(res.status, 415, res.text);
  });

  it('an executable extension is refused', async () => {
    const res = await upload('payload.exe', PDF, { kind: 'document' });
    assert.equal(res.status, 415, res.text);
  });

  it('an HTML file with a video extension is refused', async () => {
    const res = await upload('clip.mp4', Buffer.from('<html><script>alert(1)</script></html>'), { kind: 'video' });
    assert.equal(res.status, 415, res.text);
  });

  it('a real MP4 is accepted as a video, and a real WebM too', async () => {
    trackUpload(await upload('cours.mp4', MP4, { kind: 'video' }));
    const webm = trackUpload(await upload('cours.webm', WEBM, { kind: 'video' }));
    assert.equal(webm.status, 201, webm.text);
  });

  it('a document larger than 20 MB is refused with 413', async () => {
    const big = Buffer.concat([PDF, Buffer.alloc(20 * 1024 * 1024 + 1, 0x41)]);
    const res = await upload('gros.pdf', big, { kind: 'document' });
    assert.equal(res.status, 413, res.text);
  });

  it('an unknown upload kind is refused', async () => {
    const res = await upload('fiche.pdf', PDF, { kind: 'image' });
    assert.equal(res.status, 400);
    assert.equal(res.json?.code, 'VALIDATION_FAILED');
  });

  it('a request with no file is refused', async () => {
    const res = await call('POST', '/upload?kind=document', { token: ids.adminToken, form: new FormData() });
    assert.equal(res.status, 400, res.text);
  });

  it('a student cannot upload at all', async () => {
    const res = await upload('fiche.pdf', PDF, { kind: 'document', token: ids.studentToken });
    assert.equal(res.status, 403);
  });
});
