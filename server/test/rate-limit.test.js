// Black-box tests for rate limiting on login, signup and the public forms.
//
// Run against a FRESH backend: Node keeps its counters in memory, so a server that has already
// handled requests from this machine will start with some quota used up. Run this suite after
// api-ownership.test.js, or restart the server first.
//
//   API_BASE=http://127.0.0.1:5010/api DB_PORT=3307 DB_NAME=tilmid_test npm run test:ratelimit

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
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
  throw new Error(`Refusing to run: this suite truncates rate-limit tables. Use DB_NAME=tilmid_test (got ${DB.database}).`);
}
const pool = mysql.createPool({ ...DB, connectionLimit: 2 });

const ADMIN = { email: `admin-rl-${crypto.randomBytes(3).toString('hex')}@example.test`, password: crypto.randomBytes(12).toString('base64url') };
const seenAccounts = []; // full identifiers, so the tests can check they never appear in the admin view
const rand = (n = 6) => crypto.randomBytes(n).toString('hex');
const newEmail = () => { const e = `rl-${rand()}@example.test`; seenAccounts.push(e); return e; };
const newPhone = () => { const p = `06${String(parseInt(rand(4), 16)).padStart(8, '0').slice(0, 8)}`; seenAccounts.push(p); return p; };

async function call(method, route, { token, body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${route}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not JSON */ }
  return { status: res.status, json, text, retryAfter: res.headers.get('retry-after') };
}

// Each protected route: how to build a request for a given account, and what that account is.
const ROUTES = [
  {
    name: 'auth.login', path: '/auth/login', newAccount: newEmail,
    body: (acct) => ({ email: acct, password: 'wrong-password-1' }),
  },
  {
    name: 'auth.student_login', path: '/students/login', newAccount: newEmail,
    body: (acct) => ({ username: acct, password: 'wrong-password-1' }),
  },
  {
    name: 'auth.register', path: '/auth/register', newAccount: newEmail,
    body: (acct) => ({ username: `u${rand(3)}`, email: acct, password: 'Password123' }),
  },
  {
    name: 'contact.message', path: '/messages', newAccount: newPhone,
    body: (acct) => ({ name: 'Visiteur', phone: acct, message: 'bonjour' }),
  },
  {
    name: 'contact.coaching_request', path: '/coaching-requests', newAccount: newPhone,
    body: (acct) => ({ name: 'Visiteur', phone: acct, grade: 'Bac' }),
  },
  {
    name: 'contact.orientation_request', path: '/orientation-requests', newAccount: newPhone,
    body: (acct) => ({ name: 'Visiteur', phone: acct, filiere: 'x', schoolType: 'x', city: 'x', bacYear: '2026', pack: 'x' }),
  },
];

before(async () => {
  // Fresh rate-limit state in the database backend (PHP); Node is reset by restarting the server.
  await pool.query('TRUNCATE TABLE login_attempts');
  await pool.query('TRUNCATE TABLE rate_limit_events');
  const hash = bcrypt.hashSync(ADMIN.password, 4);
  await pool.query("INSERT INTO users (username, email, password_hash, role) VALUES ('rl-admin', ?, ?, 'admin')", [ADMIN.email, hash]);
  const login = await call('POST', '/auth/login', { body: { email: ADMIN.email, password: ADMIN.password } });
  assert.equal(login.status, 200, `admin login failed: ${login.text}`);
  ADMIN.token = login.json.token;
});

after(async () => {
  await pool.end();
});

function assertRateLimited(res, label) {
  assert.equal(res.status, 429, `${label}: expected 429, got ${res.status} ${res.text}`);
  assert.equal(res.json?.code, 'RATE_LIMITED', `${label}: body must carry code RATE_LIMITED`);
  assert.equal(typeof res.json.message, 'string', `${label}: body must carry a message`);
  assert.ok(res.json.message.length > 0, `${label}: message is empty`);
  assert.ok(Number.isInteger(res.json.retryAfterSeconds) && res.json.retryAfterSeconds > 0, `${label}: retryAfterSeconds missing`);
  assert.ok(res.retryAfter !== null, `${label}: Retry-After header missing`);
  assert.equal(Number(res.retryAfter), res.json.retryAfterSeconds, `${label}: header and body disagree on the wait`);
}

describe('rate limits: each protected route', () => {
  for (const r of ROUTES) {
    describe(r.name, () => {
      it('blocks repeated requests for one account with 429 RATE_LIMITED (account limit)', async () => {
        const acct = r.newAccount();
        let blocked = null;
        for (let i = 0; i < 15 && !blocked; i++) {
          const res = await call('POST', r.path, { body: r.body(acct) });
          if (res.status === 429) blocked = res;
        }
        assert.ok(blocked, 'the same account was never blocked');
        assertRateLimited(blocked, r.name);
      });

      it('blocks one IP that cycles through new accounts (IP limit)', async () => {
        let blocked = null;
        for (let i = 0; i < 40 && !blocked; i++) {
          const res = await call('POST', r.path, { body: r.body(r.newAccount()) });
          if (res.status === 429) blocked = res;
        }
        assert.ok(blocked, 'one IP was never blocked across new accounts');
        assertRateLimited(blocked, r.name);
      });

      it('keeps refusing new accounts from an IP that is over its limit', async () => {
        // The IP limit is exhausted by now, so this must still be 429 and must not claim the account.
        const res = await call('POST', r.path, { body: r.body(r.newAccount()) });
        assert.equal(res.status, 429);
        const events = await call('GET', '/admin/abuse', { token: ADMIN.token });
        const latest = events.json.recent.find((e) => e.route === r.name);
        assert.ok(latest, `no abuse event recorded for ${r.name}`);
      });
    });
  }
});

describe('abuse is logged and visible to admins', () => {
  it('admin view lists blocks per route with scope, without full account identifiers', async () => {
    const res = await call('GET', '/admin/abuse', { token: ADMIN.token });
    assert.equal(res.status, 200, res.text);
    const routes = new Set(res.json.recent.map((e) => e.route));
    for (const r of ROUTES) assert.ok(routes.has(r.name), `no events recorded for ${r.name}`);
    assert.ok(res.json.recent.some((e) => e.scope === 'account'), 'no account-scope events');
    assert.ok(res.json.recent.some((e) => e.scope === 'ip'), 'no ip-scope events');
    for (const acct of seenAccounts) {
      assert.ok(!res.text.includes(acct), 'a full account identifier leaked into the admin view');
    }
  });

  it('admin view ranks the offending IP, so repeated abuse stands out', async () => {
    const res = await call('GET', '/admin/abuse', { token: ADMIN.token });
    assert.ok(res.json.offenders.length >= 1);
    assert.ok(res.json.offenders[0].blocks >= 5, `top offender has only ${res.json.offenders[0].blocks} blocks`);
    assert.ok(res.json.offenders[0].routes.includes('auth.login'));
  });

  it('the abuse endpoint is admin-only', async () => {
    const anon = await call('GET', '/admin/abuse');
    assert.equal(anon.status, 401);
  });
});
