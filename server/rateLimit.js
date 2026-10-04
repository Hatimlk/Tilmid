// Rate limiting for abuse-prone routes (logins, signup, public contact forms, and anything that
// calls a paid API). Every route gets two independent limits:
//   - per client IP: one visitor hammering many accounts
//   - per account:   many visitors hammering one account (email, username or phone)
// Going over either limit returns 429 with code RATE_LIMITED, a Retry-After header and the
// seconds to wait. Every block is logged and stored in rate_limit_events, so repeated abuse
// is visible in the server log and on the admin "Sécurité" endpoint.

const rateLimit = require('express-rate-limit');
const db = require('./db');

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// A client with this many blocks in the last hour is reported as repeated abuse.
const REPEAT_THRESHOLD = 5;
const RETENTION_DAYS = 90;

// Shows enough of an account identifier to recognise it in logs, without writing it in full.
function maskAccount(value) {
    const text = String(value || '').trim();
    if (!text) return null;
    if (text.includes('@')) {
        const [user, domain] = text.split('@');
        return `${user.slice(0, 1)}***@${domain}`;
    }
    return `${text.slice(0, 2)}***${text.slice(-2)}`;
}

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const normalizePhone = (value) => String(value || '').replace(/\D/g, '');

async function ensureRateLimitTable() {
    await db.query(`CREATE TABLE IF NOT EXISTS rate_limit_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route VARCHAR(100) NOT NULL,
        scope ENUM('ip', 'account') NOT NULL,
        client_ip VARCHAR(64) NOT NULL,
        account VARCHAR(255) DEFAULT NULL,
        retry_after_seconds INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ip_created (client_ip, created_at),
        INDEX idx_created (created_at)
    )`);
    await db.query('DELETE FROM rate_limit_events WHERE created_at < (NOW() - INTERVAL ? DAY)', [RETENTION_DAYS]);
}

async function recordAbuse({ route, scope, ip, account, retryAfter }) {
    const masked = maskAccount(account);
    console.warn(`[abuse] 429 route=${route} scope=${scope} ip=${ip} account=${masked || '-'} retry_after=${retryAfter}s`);
    try {
        await db.query(
            'INSERT INTO rate_limit_events (route, scope, client_ip, account, retry_after_seconds) VALUES (?, ?, ?, ?, ?)',
            [route, scope, ip, masked, retryAfter]
        );
        const [rows] = await db.query(
            'SELECT COUNT(*) AS blocks FROM rate_limit_events WHERE client_ip = ? AND created_at > (NOW() - INTERVAL 1 HOUR)',
            [ip]
        );
        const blocks = Number(rows[0].blocks);
        if (blocks >= REPEAT_THRESHOLD) {
            console.warn(`[abuse] REPEATED ip=${ip} blocks_last_hour=${blocks} latest_route=${route}`);
        }
    } catch (err) {
        console.error('[abuse] could not record event:', err.message);
    }
}

// Builds the 429 handler for one scope ('ip' or 'account') of one route.
function blockedResponse(route, scope, accountOf) {
    return (req, res) => {
        const retryAfter = Math.max(1, Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000));
        const minutes = Math.ceil(retryAfter / 60);
        res.setHeader('Retry-After', String(retryAfter));
        // Fire and forget: logging must not slow down the rejection.
        recordAbuse({ route, scope, ip: req.ip, account: accountOf ? accountOf(req) : null, retryAfter });
        res.status(429).json({
            code: 'RATE_LIMITED',
            message: `Trop de tentatives. Réessayez dans ${minutes} minute${minutes > 1 ? 's' : ''}.`,
            retryAfterSeconds: retryAfter,
        });
    };
}

// Returns the middleware list to put in front of a route.
//   route:        name used in logs and the admin view, e.g. 'auth.login'
//   windowMs:     length of the window
//   perIp:        max requests per IP per window
//   perAccount:   max requests per account per window (0 disables the account limit)
//   accountOf:    (req) => normalised account identifier, or '' when the request has none
//   countSuccessful: false counts only failed requests (used by logins)
function limitRoute(route, { windowMs, perIp, perAccount, accountOf, countSuccessful = true }) {
    const common = {
        windowMs,
        legacyHeaders: false,
        standardHeaders: 'draft-7',
        skipSuccessfulRequests: !countSuccessful,
    };

    const ipLimiter = rateLimit({
        ...common,
        limit: perIp,
        keyGenerator: (req) => `ip|${route}|${req.ip}`,
        handler: blockedResponse(route, 'ip', null),
    });

    if (!perAccount) return [ipLimiter];

    const accountLimiter = rateLimit({
        ...common,
        limit: perAccount,
        keyGenerator: (req) => `acct|${route}|${accountOf(req)}`,
        skip: (req) => !accountOf(req),
        handler: blockedResponse(route, 'account', accountOf),
    });
    return [ipLimiter, accountLimiter];
}

module.exports = {
    limitRoute,
    ensureRateLimitTable,
    maskAccount,
    normalizeEmail,
    normalizePhone,
    MINUTE,
    HOUR,
};
