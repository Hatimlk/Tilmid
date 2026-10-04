// Black-box API tests for route-level authorization and record ownership.
//
// They run against a live backend (Node server/index.js or server-php/index.php) backed by a
// dedicated, disposable MySQL/MariaDB database. Every run TRUNCATES the tables, so the test
// database is refused unless it is named tilmid_test.
//
//   API_BASE=http://127.0.0.1:5010/api DB_PORT=3307 DB_NAME=tilmid_test npm test
//
// Each route in the tables below gets at least one test, and every test that touches a
// student-owned record checks a second student (B) cannot read or change student A's data.

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
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
  throw new Error(`Refusing to run: these tests truncate every table. Use DB_NAME=tilmid_test (got ${DB.database}).`);
}

const pool = mysql.createPool({ ...DB, connectionLimit: 4 });

const TABLES = [
  'users', 'posts', 'coaches', 'students', 'appointments', 'activity_log', 'success_stories',
  'contact_messages', 'resources', 'timetable_tasks', 'coaching_requests', 'orientation_requests',
  'self_guided_plans', 'goals', 'revision_sessions', 'habits', 'checkins', 'course_modules',
  'course_module_progress', 'feedback', 'collective_sessions', 'collective_session_registrations',
  'tool_options', 'platform_settings', 'notifications', 'login_attempts', 'rate_limit_events',
];

// Fresh random passwords every run: nothing secret-shaped lives in the repository.
const PASSWORDS = Object.fromEntries(['admin', 'a', 'b', 'c'].map((k) => [k, require('crypto').randomBytes(12).toString('base64url')]));

// Shared fixtures, filled in by before().
const F = {};

async function call(method, route, { token, body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${route}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* non-JSON body */ }
  return { status: res.status, json, text };
}

async function loginStudent(username, password) {
  const r = await call('POST', '/students/login', { body: { username, password } });
  assert.equal(r.status, 200, `student login failed for ${username}: ${r.text}`);
  return r.json.token;
}

async function loginAdmin() {
  const r = await call('POST', '/auth/login', { body: { email: 'admin-test@example.test', password: PASSWORDS.admin } });
  assert.equal(r.status, 200, `admin login failed: ${r.text}`);
  return r.json.token;
}

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of TABLES) await conn.query(`TRUNCATE TABLE ${t}`);
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    const hash = (pw) => bcrypt.hashSync(pw, 4);
    const [adminRes] = await conn.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ('admin-test', 'admin-test@example.test', ?, 'admin')",
      [hash(PASSWORDS.admin)]
    );
    F.adminId = adminRes.insertId;

    const [coachRes] = await conn.query(
      "INSERT INTO coaches (name, email, phone, specialty) VALUES ('Coach Test', 'coach-secret@example.test', '+212600000001', 'Maths')"
    );
    F.coachId = coachRes.insertId;

    const student = async (key, username, pkg) => {
      const [r] = await conn.query(
        "INSERT INTO students (name, username, email, password_hash, status, package, coach_id) VALUES (?, ?, ?, ?, 'active', ?, ?)",
        [`Student ${key.toUpperCase()}`, username, `${username}@example.test`, hash(PASSWORDS[key]), pkg, F.coachId]
      );
      return r.insertId;
    };
    F.a = await student('a', 'stu-a', 'boost');
    F.b = await student('b', 'stu-b', 'essentiel');
    F.c = await student('c', 'stu-c', null);

    // Owned records: one per student, so cross-student reads and writes are detectable.
    const [g] = await conn.query("INSERT INTO goals (student_id, title) VALUES (?, 'Goal A')", [F.a]);
    F.goalA = g.insertId;
    const [g2] = await conn.query("INSERT INTO goals (student_id, title) VALUES (?, 'Goal B')", [F.b]);
    F.goalB = g2.insertId;

    const [r1] = await conn.query("INSERT INTO revision_sessions (student_id, subject) VALUES (?, 'Rev A')", [F.a]);
    F.revA = r1.insertId;
    const [r2] = await conn.query("INSERT INTO revision_sessions (student_id, subject) VALUES (?, 'Rev B')", [F.b]);
    F.revB = r2.insertId;

    const [h1] = await conn.query("INSERT INTO habits (student_id, name, days) VALUES (?, 'Habit A', '[false,false,false,false,false,false,false]')", [F.a]);
    F.habitA = h1.insertId;
    const [h2] = await conn.query("INSERT INTO habits (student_id, name, days) VALUES (?, 'Habit B', '[false,false,false,false,false,false,false]')", [F.b]);
    F.habitB = h2.insertId;

    const [t1] = await conn.query("INSERT INTO timetable_tasks (student_id, subject, day, start_time, end_time) VALUES (?, 'TT A', 'lundi', '08:00', '09:00')", [F.a]);
    F.ttA = t1.insertId;
    const [t2] = await conn.query("INSERT INTO timetable_tasks (student_id, subject, day, start_time, end_time) VALUES (?, 'TT B', 'lundi', '08:00', '09:00')", [F.b]);
    F.ttB = t2.insertId;

    const [c1] = await conn.query(
      "INSERT INTO checkins (student_id, adherence, days_respected, concentration) VALUES (?, 5, 3, 3)", [F.a]);
    F.checkinA = c1.insertId;

    const [f1] = await conn.query("INSERT INTO feedback (student_id, message, author_name) VALUES (?, 'Feedback A', 'Admin')", [F.a]);
    F.feedbackA = f1.insertId;
    const [f2] = await conn.query("INSERT INTO feedback (student_id, message, author_name) VALUES (?, 'Feedback B', 'Admin')", [F.b]);
    F.feedbackB = f2.insertId;

    const [n1] = await conn.query("INSERT INTO notifications (student_id, title, message) VALUES (?, 'Notif A', 'hello')", [F.a]);
    F.notifA = n1.insertId;
    const [n2] = await conn.query("INSERT INTO notifications (student_id, title, message) VALUES (?, 'Notif B', 'hello')", [F.b]);
    F.notifB = n2.insertId;

    await conn.query(
      "INSERT INTO self_guided_plans (student_id, objective, actions) VALUES (?, 'Plan A', '[{\"id\":\"x1\",\"label\":\"A1\",\"done\":false}]')", [F.a]);
    await conn.query(
      "INSERT INTO self_guided_plans (student_id, objective, actions) VALUES (?, 'Plan B', '[{\"id\":\"y1\",\"label\":\"B1\",\"done\":false}]')", [F.b]);

    const [ap1] = await conn.query(
      "INSERT INTO appointments (student_name, title, date, time, student_id, category) VALUES ('Student A', 'Coaching A', '2026-01-10', '10:00', ?, 'coaching')", [F.a]);
    F.apptA = ap1.insertId;
    const [ap2] = await conn.query(
      "INSERT INTO appointments (student_name, title, date, time, student_id, category) VALUES ('Student B', 'Coaching B', '2026-01-11', '10:00', ?, 'coaching')", [F.b]);
    F.apptB = ap2.insertId;

    const [m1] = await conn.query(
      "INSERT INTO course_modules (slug, title, position, video_url, video_source) VALUES ('mod-1', 'Module 1', 1, 'https://videos.example.test/m1.mp4', 'link')");
    F.module1 = m1.insertId;

    await conn.query("INSERT INTO resources (title, type, url, subject) VALUES ('Fiche', 'summary', '/api/uploads/documents/fiche.pdf', 'Maths')");

    const [p1] = await conn.query(
      "INSERT INTO posts (title, content, status) VALUES ('Public post', 'hi', 'published')");
    const [p2] = await conn.query(
      "INSERT INTO posts (title, content, status) VALUES ('Secret draft', 'draft body', 'draft')");
    F.publicPost = p1.insertId;
    F.draftPost = p2.insertId;

    const [s1] = await conn.query(
      "INSERT INTO collective_sessions (title, date, time, capacity) VALUES ('Session 1', '2026-02-01', '18:00', 10)");
    F.session1 = s1.insertId;
    await conn.query('INSERT INTO collective_session_registrations (session_id, student_id) VALUES (?, ?)', [F.session1, F.b]);

    await conn.query("INSERT INTO tool_options (category, label, position) VALUES ('subject', 'Maths', 1)");
  } finally {
    conn.release();
  }
}

async function rowExists(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows.length > 0;
}

async function scalar(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows[0] ? Object.values(rows[0])[0] : null;
}

before(async () => {
  await seed();
  F.tokenA = await loginStudent('stu-a', PASSWORDS.a);
  F.tokenB = await loginStudent('stu-b', PASSWORDS.b);
  F.tokenC = await loginStudent('stu-c', PASSWORDS.c);
  F.tokenAdmin = await loginAdmin();
});

after(async () => {
  await pool.end();
});

/* ---------------- 1. ROLE GATES: every route ---------------- */
// Expected outcome for each route when the caller is anonymous, a student, or an admin.
//   admin   -> anonymous 401, student 403. Admin-only handlers never see the request.
//   student -> anonymous 401, admin 403. Student-only handlers never see the request.
//   staff   -> student or admin allowed, anonymous 401.
//   auth    -> any signed-in user allowed, anonymous 401.
//   public  -> anonymous allowed.
// Gate checks use ids that exist, so a gate that fails open would change data and be caught.

const ROUTE_GATES = [
  // [label, method, path, body, gate]
  ['GET /health', 'GET', '/health', undefined, 'public'],
  ['GET /settings', 'GET', '/settings', undefined, 'public'],
  ['POST /settings', 'POST', '/settings', {}, 'admin'],
  ['POST /auth/register', 'POST', '/auth/register', { username: 'x', email: 'x@example.test', password: 'short' }, 'public'],
  ['POST /auth/login', 'POST', '/auth/login', { email: 'nobody@example.test', password: 'wrongpass1' }, 'public'],
  ['POST /students/login', 'POST', '/students/login', { username: 'nobody', password: 'wrongpass1' }, 'public'],
  ['GET /auth/me', 'GET', '/auth/me', undefined, 'auth'],
  ['GET /users', 'GET', '/users', undefined, 'admin'],
  ['POST /users', 'POST', '/users', { username: 'x', email: 'x@example.test', password: 'Password123' }, 'admin'],
  ['DELETE /users/:id', 'DELETE', '/users/999999', undefined, 'admin'],
  ['POST /upload', 'POST', '/upload', {}, 'admin'],
  ['GET /posts', 'GET', '/posts', undefined, 'public'],
  ['POST /posts', 'POST', '/posts', { title: 'x' }, 'admin'],
  ['DELETE /posts/:id', 'DELETE', '/posts/999999', undefined, 'admin'],
  ['GET /students', 'GET', '/students', undefined, 'admin'],
  ['POST /students', 'POST', '/students', { name: 'x', username: 'x' }, 'admin'],
  ['POST /notifications', 'POST', '/notifications', { title: 'x', message: 'y', target: { all: true } }, 'admin'],
  ['GET /notifications', 'GET', '/notifications', undefined, 'student'],
  ['POST /notifications/:id/read', 'POST', '/notifications/999999/read', {}, 'student'],
  ['GET /admin/notifications', 'GET', '/admin/notifications', undefined, 'admin'],
  ['GET /tool-options', 'GET', '/tool-options', undefined, 'auth'],
  ['POST /tool-options', 'POST', '/tool-options', { category: 'subject', label: 'x' }, 'admin'],
  ['DELETE /tool-options/:id', 'DELETE', '/tool-options/999999', undefined, 'admin'],
  ['GET /coaches', 'GET', '/coaches', undefined, 'auth'],
  ['POST /coaches', 'POST', '/coaches', { name: 'x' }, 'admin'],
  ['DELETE /coaches/:id', 'DELETE', '/coaches/999999', undefined, 'admin'],
  ['GET /admin/coaches-overview', 'GET', '/admin/coaches-overview', undefined, 'admin'],
  ['DELETE /students/:id', 'DELETE', '/students/999999', undefined, 'admin'],
  ['GET /appointments', 'GET', '/appointments', undefined, 'admin'],
  ['POST /appointments', 'POST', '/appointments', { title: 'x' }, 'admin'],
  ['DELETE /appointments/:id', 'DELETE', '/appointments/999999', undefined, 'admin'],
  ['GET /activity', 'GET', '/activity', undefined, 'admin'],
  ['GET /stories', 'GET', '/stories', undefined, 'public'],
  ['POST /stories', 'POST', '/stories', { studentName: 'x' }, 'admin'],
  ['GET /messages', 'GET', '/messages', undefined, 'admin'],
  ['POST /messages', 'POST', '/messages', { name: 'Visitor', phone: '0600000000', message: 'hi' }, 'public'],
  ['GET /coaching-requests', 'GET', '/coaching-requests', undefined, 'admin'],
  ['POST /coaching-requests', 'POST', '/coaching-requests', { name: 'V', phone: '0600000000', grade: 'Bac' }, 'public'],
  ['GET /orientation-requests', 'GET', '/orientation-requests', undefined, 'admin'],
  ['POST /orientation-requests', 'POST', '/orientation-requests', {
    name: 'V', phone: '0600000000', filiere: 'x', schoolType: 'x', city: 'x', bacYear: '2026', pack: 'x',
  }, 'public'],
  ['GET /plan', 'GET', '/plan', undefined, 'staff'],
  ['POST /plan', 'POST', '/plan', { objective: 'x' }, 'student'],
  ['POST /plan/progress', 'POST', '/plan/progress', { actions: [] }, 'student'],
  ['GET /goals', 'GET', '/goals', undefined, 'staff'],
  ['POST /goals', 'POST', '/goals', { title: 'x' }, 'student'],
  ['DELETE /goals/:id', 'DELETE', '/goals/999999', undefined, 'student'],
  ['GET /revisions', 'GET', '/revisions', undefined, 'staff'],
  ['POST /revisions', 'POST', '/revisions', { subject: 'x' }, 'student'],
  ['DELETE /revisions/:id', 'DELETE', '/revisions/999999', undefined, 'student'],
  ['GET /habits', 'GET', '/habits', undefined, 'staff'],
  ['POST /habits', 'POST', '/habits', { name: 'x' }, 'student'],
  ['DELETE /habits/:id', 'DELETE', '/habits/999999', undefined, 'student'],
  ['GET /checkins', 'GET', '/checkins', undefined, 'staff'],
  ['POST /checkins', 'POST', '/checkins', { adherence: 5 }, 'student'],
  ['GET /timetable', 'GET', '/timetable', undefined, 'staff'],
  ['POST /timetable', 'POST', '/timetable', { subject: 'x' }, 'student'],
  ['DELETE /timetable/:id', 'DELETE', '/timetable/999999', undefined, 'student'],
  ['GET /resources', 'GET', '/resources', undefined, 'auth'],
  ['POST /resources', 'POST', '/resources', { title: 'x' }, 'admin'],
  ['DELETE /resources/:id', 'DELETE', '/resources/999999', undefined, 'admin'],
  ['GET /course-modules', 'GET', '/course-modules', undefined, 'staff'],
  ['POST /course-modules/:id/progress', 'POST', '/course-modules/999999/progress', { watchedSeconds: 1, durationSeconds: 2 }, 'student'],
  ['POST /course-modules/:id', 'POST', '/course-modules/999999', { videoUrl: '' }, 'admin'],
  ['POST /course-modules', 'POST', '/course-modules', { title: 'x' }, 'admin'],
  ['POST /course-modules/:id/details', 'POST', '/course-modules/999999/details', { title: 'x' }, 'admin'],
  ['DELETE /course-modules/:id', 'DELETE', '/course-modules/999999', undefined, 'admin'],
  ['GET /coaching-sessions', 'GET', '/coaching-sessions', undefined, 'staff'],
  ['GET /feedback', 'GET', '/feedback', undefined, 'staff'],
  ['POST /feedback', 'POST', '/feedback', { studentId: 1, message: 'x' }, 'admin'],
  ['GET /admin/feedback', 'GET', '/admin/feedback', undefined, 'admin'],
  ['GET /admin/plans', 'GET', '/admin/plans', undefined, 'admin'],
  ['POST /admin/plans/:studentId', 'POST', '/admin/plans/1', { objective: 'x', actions: [{ id: '1' }] }, 'admin'],
  ['GET /admin/checkins', 'GET', '/admin/checkins', undefined, 'admin'],
  ['GET /admin/progress-overview', 'GET', '/admin/progress-overview', undefined, 'admin'],
  ['GET /collective-sessions', 'GET', '/collective-sessions', undefined, 'auth'],
  ['POST /collective-sessions', 'POST', '/collective-sessions', { title: 'x', date: '2026-03-01', time: '10:00' }, 'admin'],
  ['DELETE /collective-sessions/:id', 'DELETE', '/collective-sessions/999999', undefined, 'admin'],
  ['GET /collective-sessions/:id/registrations', 'GET', '/collective-sessions/999999/registrations', undefined, 'admin'],
  ['POST /collective-sessions/:id/register', 'POST', '/collective-sessions/999999/register', {}, 'student'],
  ['DELETE /collective-sessions/:id/register', 'DELETE', '/collective-sessions/999999/register', undefined, 'student'],
  ['POST /collective-sessions/:id/attendance', 'POST', '/collective-sessions/999999/attendance', { studentId: 1, attended: true }, 'admin'],
];

describe('route role gates', () => {
  for (const [label, method, route, body, gate] of ROUTE_GATES) {
    it(`${label} is gated as "${gate}"`, async () => {
      const anon = await call(method, route, { body });
      if (gate === 'public') {
        assert.notEqual(anon.status, 401, 'public route must not demand a token');
        assert.notEqual(anon.status, 403, 'public route must not forbid anonymous callers');
        return;
      }
      assert.equal(anon.status, 401, `anonymous request should be 401, got ${anon.status}`);

      if (gate === 'admin') {
        const student = await call(method, route, { token: F.tokenA, body });
        assert.equal(student.status, 403, `student should get 403, got ${student.status}`);
      }
      if (gate === 'student') {
        const admin = await call(method, route, { token: F.tokenAdmin, body });
        assert.equal(admin.status, 403, `admin should get 403 on student-only route, got ${admin.status}`);
      }
    });
  }
});

/* ---------------- 2. OWNERSHIP: student-owned data ---------------- */

describe('student-owned reads ignore ?studentId for students', () => {
  const cases = [
    ['GET /plan', '/plan', 'Plan B'],
    ['GET /goals', '/goals', 'Goal B'],
    ['GET /revisions', '/revisions', 'Rev B'],
    ['GET /habits', '/habits', 'Habit B'],
    ['GET /timetable', '/timetable', 'TT B'],
    ['GET /feedback', '/feedback', 'Feedback B'],
  ];
  for (const [label, route, forbidden] of cases) {
    it(`${label}?studentId=B as student A never returns B's data`, async () => {
      const r = await call('GET', `${route}?studentId=${F.b}`, { token: F.tokenA });
      assert.equal(r.status, 200, r.text);
      assert.ok(!r.text.includes(forbidden), `${label} leaked "${forbidden}" to student A`);
      // A's own data is still returned when the query asks for someone else.
      const ownLabel = { '/plan': 'Plan A', '/goals': 'Goal A', '/revisions': 'Rev A', '/habits': 'Habit A', '/timetable': 'TT A', '/feedback': 'Feedback A' }[route];
      assert.ok(r.text.includes(ownLabel), `expected own record "${ownLabel}" in response`);
    });
  }

  it('GET /checkins?studentId=B as student A never returns B\'s checkins', async () => {
    const r = await call('GET', `/checkins?studentId=${F.b}`, { token: F.tokenA });
    assert.equal(r.status, 200);
    assert.ok(Array.isArray(r.json));
    assert.ok(r.json.every((c) => c.student_id === F.a), 'checkins contained another student\'s rows');
  });

  it('admin must name a student on staff-readable routes (GET /goals without studentId -> 400)', async () => {
    const r = await call('GET', '/goals', { token: F.tokenAdmin });
    assert.equal(r.status, 400);
  });

  it('admin can read a named student\'s goals (GET /goals?studentId=B)', async () => {
    const r = await call('GET', `/goals?studentId=${F.b}`, { token: F.tokenAdmin });
    assert.equal(r.status, 200);
    assert.ok(r.text.includes('Goal B'));
  });

  it('GET /coaching-sessions as student A never returns B\'s appointments', async () => {
    const r = await call('GET', `/coaching-sessions?studentId=${F.b}`, { token: F.tokenA });
    assert.equal(r.status, 200);
    assert.ok(!r.text.includes('Coaching B'));
    assert.ok(r.text.includes('Coaching A'));
  });

  it('GET /coaching-sessions as admin returns every student\'s sessions', async () => {
    const r = await call('GET', '/coaching-sessions', { token: F.tokenAdmin });
    assert.equal(r.status, 200);
    assert.ok(r.text.includes('Coaching A') && r.text.includes('Coaching B'));
  });

  it('GET /notifications as student A returns only A\'s notifications', async () => {
    const r = await call('GET', '/notifications', { token: F.tokenA });
    assert.equal(r.status, 200);
    assert.ok(r.text.includes('Notif A'));
    assert.ok(!r.text.includes('Notif B'));
  });
});

describe('student-owned writes cannot touch another student\'s records', () => {
  it('POST /goals with B\'s goal id returns 404 and leaves B\'s goal unchanged', async () => {
    const r = await call('POST', '/goals', { token: F.tokenA, body: { id: F.goalB, title: 'hacked' } });
    assert.equal(r.status, 404);
    assert.equal(await scalar('SELECT title FROM goals WHERE id = ?', [F.goalB]), 'Goal B');
  });

  it('POST /goals with own id still updates own goal', async () => {
    const r = await call('POST', '/goals', { token: F.tokenA, body: { id: F.goalA, title: 'Goal A v2', status: 'en_cours' } });
    assert.equal(r.status, 200, r.text);
    assert.equal(await scalar('SELECT title FROM goals WHERE id = ?', [F.goalA]), 'Goal A v2');
  });

  it('DELETE /goals/:id with B\'s id returns 404 and keeps B\'s goal', async () => {
    const r = await call('DELETE', `/goals/${F.goalB}`, { token: F.tokenA });
    assert.equal(r.status, 404);
    assert.ok(await rowExists('SELECT id FROM goals WHERE id = ?', [F.goalB]));
  });

  it('DELETE /goals/:id with own id deletes it', async () => {
    const [ins] = await pool.query("INSERT INTO goals (student_id, title) VALUES (?, 'to delete')", [F.a]);
    const r = await call('DELETE', `/goals/${ins.insertId}`, { token: F.tokenA });
    assert.equal(r.status, 200);
    assert.equal(await rowExists('SELECT id FROM goals WHERE id = ?', [ins.insertId]), false);
  });

  it('DELETE /revisions/:id with B\'s id returns 404 and keeps B\'s session', async () => {
    const r = await call('DELETE', `/revisions/${F.revB}`, { token: F.tokenA });
    assert.equal(r.status, 404);
    assert.ok(await rowExists('SELECT id FROM revision_sessions WHERE id = ?', [F.revB]));
  });

  it('DELETE /revisions/:id with own id deletes it', async () => {
    const [ins] = await pool.query("INSERT INTO revision_sessions (student_id, subject) VALUES (?, 'tmp')", [F.a]);
    const r = await call('DELETE', `/revisions/${ins.insertId}`, { token: F.tokenA });
    assert.equal(r.status, 200);
    assert.equal(await rowExists('SELECT id FROM revision_sessions WHERE id = ?', [ins.insertId]), false);
  });

  it('POST /habits with B\'s habit id returns 404 and leaves it unchanged', async () => {
    const r = await call('POST', '/habits', { token: F.tokenA, body: { id: F.habitB, name: 'hacked', days: [true, true, true, true, true, true, true] } });
    assert.equal(r.status, 404);
    assert.equal(await scalar('SELECT name FROM habits WHERE id = ?', [F.habitB]), 'Habit B');
  });

  it('DELETE /habits/:id with B\'s id returns 404 and keeps it', async () => {
    const r = await call('DELETE', `/habits/${F.habitB}`, { token: F.tokenA });
    assert.equal(r.status, 404);
    assert.ok(await rowExists('SELECT id FROM habits WHERE id = ?', [F.habitB]));
  });

  it('DELETE /timetable/:id with B\'s id returns 404 and keeps it', async () => {
    const r = await call('DELETE', `/timetable/${F.ttB}`, { token: F.tokenA });
    assert.equal(r.status, 404);
    assert.ok(await rowExists('SELECT id FROM timetable_tasks WHERE id = ?', [F.ttB]));
  });

  it('POST /notifications/:id/read on B\'s notification returns 404 and leaves it unread', async () => {
    const r = await call('POST', `/notifications/${F.notifB}/read`, { token: F.tokenA, body: {} });
    assert.equal(r.status, 404);
    assert.equal(await scalar('SELECT read_at FROM notifications WHERE id = ?', [F.notifB]), null);
  });

  it('POST /notifications/:id/read on own notification marks it read', async () => {
    const r = await call('POST', `/notifications/${F.notifA}/read`, { token: F.tokenA, body: {} });
    assert.equal(r.status, 200);
    assert.notEqual(await scalar('SELECT read_at FROM notifications WHERE id = ?', [F.notifA]), null);
  });

  it('POST /plan/progress writes only the caller\'s plan', async () => {
    const before = await scalar('SELECT actions FROM self_guided_plans WHERE student_id = ?', [F.b]);
    const r = await call('POST', '/plan/progress', { token: F.tokenA, body: { actions: [{ id: 'x1', done: true }, { id: 'y1', done: true }] } });
    assert.equal(r.status, 200, r.text);
    assert.equal(await scalar('SELECT actions FROM self_guided_plans WHERE student_id = ?', [F.b]), before, 'B\'s plan was modified');
  });

  it('POST /plan writes to the caller\'s own plan, never a named student\'s', async () => {
    const r = await call('POST', '/plan', { token: F.tokenA, body: { objective: 'Mon objectif', actions: [] } });
    assert.equal(r.status, 200, r.text);
    assert.equal(await scalar('SELECT objective FROM self_guided_plans WHERE student_id = ?', [F.b]), 'Plan B');
  });

  it('POST /admin/plans/:studentId is admin-only and rejects students without a Boost/Premium pack', async () => {
    const r = await call('POST', `/admin/plans/${F.b}`, { token: F.tokenAdmin, body: { objective: 'x', actions: [{ id: '1' }] } });
    assert.equal(r.status, 403, 'essentiel student should not get a self-guided plan');
  });

  it('POST /checkins is refused for a package without check-ins (essentiel)', async () => {
    const r = await call('POST', '/checkins', { token: F.tokenB, body: { adherence: 5, daysRespected: 3, concentration: 3 } });
    assert.equal(r.status, 403);
  });
});

/* ---------------- 3. ENTITLEMENTS: paid content ---------------- */

describe('paid learning content', () => {
  it('GET /course-modules hides video links from a student with no package', async () => {
    const r = await call('GET', '/course-modules', { token: F.tokenC });
    assert.equal(r.status, 200);
    const mod = r.json.find((m) => m.id === F.module1);
    assert.ok(mod, 'module titles should still be listed');
    assert.equal(mod.video_url, null);
    assert.equal(mod.video_source, null);
  });

  it('GET /course-modules returns the video link to an entitled student', async () => {
    const r = await call('GET', '/course-modules', { token: F.tokenB });
    assert.equal(r.status, 200);
    assert.equal(r.json.find((m) => m.id === F.module1).video_url, 'https://videos.example.test/m1.mp4');
  });

  it('GET /course-modules returns video links to admins', async () => {
    const r = await call('GET', '/course-modules', { token: F.tokenAdmin });
    assert.equal(r.json.find((m) => m.id === F.module1).video_url, 'https://videos.example.test/m1.mp4');
  });

  it('POST /course-modules/:id/progress is refused for a student with no package', async () => {
    const r = await call('POST', `/course-modules/${F.module1}/progress`, { token: F.tokenC, body: { watchedSeconds: 10, durationSeconds: 100 } });
    assert.equal(r.status, 403);
    assert.equal(await rowExists('SELECT 1 FROM course_module_progress WHERE student_id = ?', [F.c]), false);
  });

  it('POST /course-modules/:id/progress records progress for the caller only', async () => {
    const r = await call('POST', `/course-modules/${F.module1}/progress`, { token: F.tokenB, body: { watchedSeconds: 50, durationSeconds: 100 } });
    assert.equal(r.status, 200, r.text);
    assert.ok(await rowExists('SELECT 1 FROM course_module_progress WHERE student_id = ? AND module_id = ?', [F.b, F.module1]));
    assert.equal(await rowExists('SELECT 1 FROM course_module_progress WHERE student_id = ? AND module_id = ?', [F.a, F.module1]), false);
  });

  it('POST /course-modules/:id/progress returns 404 for a module that does not exist', async () => {
    const r = await call('POST', '/course-modules/999999/progress', { token: F.tokenB, body: { watchedSeconds: 1, durationSeconds: 2 } });
    assert.equal(r.status, 404);
  });

  it('GET /resources returns nothing to a student with no package', async () => {
    const r = await call('GET', '/resources', { token: F.tokenC });
    assert.equal(r.status, 200);
    assert.deepEqual(r.json, []);
  });

  it('GET /resources returns the library to an entitled student', async () => {
    const r = await call('GET', '/resources', { token: F.tokenB });
    assert.equal(r.status, 200);
    assert.ok(r.json.length >= 1);
  });
});

/* ---------------- 4. PUBLIC DATA: drafts and staff contact details ---------------- */

describe('data hidden from non-admins', () => {
  it('GET /posts (anonymous) omits drafts', async () => {
    const r = await call('GET', '/posts');
    assert.equal(r.status, 200);
    assert.ok(r.text.includes('Public post'));
    assert.ok(!r.text.includes('Secret draft'));
  });

  it('GET /posts (student token) omits drafts', async () => {
    const r = await call('GET', '/posts', { token: F.tokenA });
    assert.ok(!r.text.includes('Secret draft'));
  });

  it('GET /posts (admin token) includes drafts', async () => {
    const r = await call('GET', '/posts', { token: F.tokenAdmin });
    assert.ok(r.text.includes('Secret draft'));
  });

  it('GET /posts/:id on a draft is not found for anonymous and student callers', async () => {
    const anon = await call('GET', `/posts/${F.draftPost}`);
    const student = await call('GET', `/posts/${F.draftPost}`, { token: F.tokenA });
    for (const r of [anon, student]) {
      assert.ok(r.status === 404 || r.status === 405, `draft should not be served, got ${r.status}`);
      assert.ok(!r.text.includes('draft body'), 'draft content leaked');
    }
  });

  it('GET /posts with an invalid token still answers anonymously, without drafts', async () => {
    const r = await call('GET', '/posts', { token: 'not-a-real-token' });
    assert.equal(r.status, 200);
    assert.ok(!r.text.includes('Secret draft'));
  });

  it('GET /coaches (student) omits coach email and phone', async () => {
    const r = await call('GET', '/coaches', { token: F.tokenA });
    assert.equal(r.status, 200);
    assert.ok(r.text.includes('Coach Test'));
    assert.ok(!r.text.includes('coach-secret@example.test'));
    assert.ok(!r.text.includes('+212600000001'));
  });

  it('GET /coaches (admin) includes contact details', async () => {
    const r = await call('GET', '/coaches', { token: F.tokenAdmin });
    assert.ok(r.text.includes('coach-secret@example.test'));
  });
});

/* ---------------- 5. COLLECTIVE SESSIONS ---------------- */

describe('collective sessions', () => {
  it('GET /collective-sessions shows a student only their own registration', async () => {
    const r = await call('GET', '/collective-sessions', { token: F.tokenA });
    assert.equal(r.status, 200);
    const s = r.json.find((x) => x.id === F.session1);
    assert.equal(!!s.my_registration, false, 'student A is not registered, must not see B\'s registration');
    assert.equal(s.registered_count, 1);
  });

  it('POST /collective-sessions/:id/register refuses a student with no package', async () => {
    const r = await call('POST', `/collective-sessions/${F.session1}/register`, { token: F.tokenC, body: {} });
    assert.equal(r.status, 403);
  });

  it('POST /collective-sessions/:id/register registers the caller, not someone else', async () => {
    const r = await call('POST', `/collective-sessions/${F.session1}/register`, { token: F.tokenA, body: {} });
    assert.equal(r.status, 201, r.text);
    assert.ok(await rowExists('SELECT 1 FROM collective_session_registrations WHERE session_id = ? AND student_id = ?', [F.session1, F.a]));
  });

  it('DELETE /collective-sessions/:id/register removes only the caller\'s registration', async () => {
    const r = await call('DELETE', `/collective-sessions/${F.session1}/register`, { token: F.tokenA });
    assert.equal(r.status, 200);
    assert.equal(await rowExists('SELECT 1 FROM collective_session_registrations WHERE session_id = ? AND student_id = ?', [F.session1, F.a]), false);
    assert.ok(await rowExists('SELECT 1 FROM collective_session_registrations WHERE session_id = ? AND student_id = ?', [F.session1, F.b]), 'B\'s registration was removed');
  });

  it('GET /collective-sessions/:id/registrations is admin-only (student gets 403)', async () => {
    const r = await call('GET', `/collective-sessions/${F.session1}/registrations`, { token: F.tokenB });
    assert.equal(r.status, 403);
  });

  it('POST /collective-sessions/:id/attendance by a student is refused and changes nothing', async () => {
    const r = await call('POST', `/collective-sessions/${F.session1}/attendance`, { token: F.tokenB, body: { studentId: F.b, attended: true } });
    assert.equal(r.status, 403);
    assert.equal(await scalar('SELECT attended FROM collective_session_registrations WHERE session_id = ? AND student_id = ?', [F.session1, F.b]), null);
  });
});

/* ---------------- 6. ADMIN INTEGRITY ---------------- */

describe('admin writes stay consistent with ownership', () => {
  it('POST /feedback rejects an appointment that belongs to a different student', async () => {
    const r = await call('POST', '/feedback', { token: F.tokenAdmin, body: { studentId: F.a, appointmentId: F.apptB, message: 'x' } });
    assert.equal(r.status, 400);
  });

  it('POST /feedback accepts an appointment that belongs to the same student', async () => {
    const r = await call('POST', '/feedback', { token: F.tokenAdmin, body: { studentId: F.a, appointmentId: F.apptA, message: 'bien joué' } });
    assert.equal(r.status, 201, r.text);
  });

  it('POST /feedback rejects a check-in that belongs to a different student', async () => {
    const r = await call('POST', '/feedback', { token: F.tokenAdmin, body: { studentId: F.b, checkinId: F.checkinA, message: 'x' } });
    assert.equal(r.status, 400);
  });

  it('POST /users rejects a password under 8 characters', async () => {
    const r = await call('POST', '/users', { token: F.tokenAdmin, body: { username: 'y', email: 'y@example.test', password: 'short' } });
    assert.equal(r.status, 400);
  });
});

/* ---------------- 7. SELF-SERVICE AUTH ---------------- */

describe('signed-in identity', () => {
  it('GET /auth/me returns the caller\'s own student record', async () => {
    const r = await call('GET', '/auth/me', { token: F.tokenA });
    assert.equal(r.status, 200);
    assert.equal(r.json.id, F.a);
    assert.equal(r.json.password_hash, undefined);
  });

  it('POST /auth/register cannot create an admin', async () => {
    const r = await call('POST', '/auth/register', { body: { username: 'sneaky', email: 'sneaky@example.test', password: 'Password123', role: 'admin' } });
    assert.equal(r.status, 201, r.text);
    assert.equal(await scalar("SELECT role FROM users WHERE email = 'sneaky@example.test'"), 'user');
  });

  it('a token for a student who has been suspended is refused on every student route', async () => {
    await pool.query("UPDATE students SET status = 'suspended' WHERE id = ?", [F.b]);
    try {
      const r = await call('GET', '/goals', { token: F.tokenB });
      assert.equal(r.status, 401);
    } finally {
      await pool.query("UPDATE students SET status = 'active' WHERE id = ?", [F.b]);
    }
  });
});
