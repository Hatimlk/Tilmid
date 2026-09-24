const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fail fast instead of silently signing tokens with a hardcoded/guessable secret.
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set. Refusing to start with an insecure default.');
    process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://tilmide.ma,https://www.tilmide.ma')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // allow same-origin/non-browser requests (no Origin header) and the explicit allowlist
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' },
});

/* ---------------- AUTH MIDDLEWARE ---------------- */

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
}

function requireAdmin(req, res, next) {
    authenticate(req, res, () => {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        next();
    });
}

// Student module routes (plan, goals, revisions, habits, error log, checkins,
// timetable) are readable by the owning student OR an admin (?studentId=),
// but writable only by the owning student — admin access there is read-only,
// matching the "aperçu lecture seule" the StudentDetail tabs promise.
function requireStudentOrAdmin(req, res, next) {
    authenticate(req, res, () => {
        if (req.user.role !== 'student' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        next();
    });
}

function requireStudent(req, res, next) {
    authenticate(req, res, () => {
        if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
        next();
    });
}

// mysql2 auto-parses JSON columns only when the DB reports a native JSON type;
// MariaDB (e.g. XAMPP's bundled server) stores JSON as TEXT and mysql2 then
// returns the raw string, so JSON columns must be parsed explicitly to behave
// the same on both. Passes already-parsed values (real MySQL) through as-is.
function parseJsonField(value, fallback) {
    if (value === null || value === undefined) return fallback;
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

// Resolves which student's data a GET should return: the caller's own id for
// a student, or the ?studentId= query param for an admin. Writes a 400 and
// returns null itself when an admin omits studentId — callers must check.
function resolveStudentId(req, res) {
    if (req.user.role === 'student') return req.user.id;
    const studentId = Number(req.query.studentId);
    if (!studentId) {
        res.status(400).json({ message: 'studentId query param required' });
        return null;
    }
    return studentId;
}

/* ---------------- ACTIVITY LOG ---------------- */
// Best-effort: a logging failure must never break the underlying action.
async function logActivity(actorId, action, entityType, entityLabel, meta) {
    try {
        const [users] = await db.query('SELECT username FROM users WHERE id = ?', [actorId]);
        const actorName = users[0]?.username || 'Admin';
        await db.query(
            'INSERT INTO activity_log (actor_name, action, entity_type, entity_label, meta) VALUES (?, ?, ?, ?, ?)',
            [actorName, action, entityType, entityLabel, meta ? JSON.stringify(meta) : null]
        );
    } catch (err) {
        console.error('Activity log insert failed:', err.message);
    }
}

// Readiness probe: do not report healthy when the API cannot reach its database.
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        console.error('Health check failed:', err.message);
        res.status(503).json({ status: 'unavailable', database: 'disconnected' });
    }
});

/* ---------------- PLATFORM SETTINGS (admin "Paramètres" module) ---------------- */
// Public GET: the public Footer needs this on every page load, unauthenticated
// visitors included. Falls back to the current hardcoded values if the row is
// somehow missing so the footer is never blank.
const SETTINGS_DEFAULTS = {
    contact_phone: '+212778104220',
    contact_email: 'contact@tilmide.ma',
    whatsapp_number: 'https://wa.me/message/GN4XKUOMHNHGO1',
    instagram_url: 'https://www.instagram.com/tilmid.official/',
    tiktok_url: 'https://www.tiktok.com/@tilmid.official?is_from_webapp=1&sender_device=pc',
    facebook_url: 'https://web.facebook.com/profile.php?id=61568646044886',
    youtube_url: 'https://www.youtube.com/@tilmid.official',
};

app.get('/api/settings', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM platform_settings WHERE id = 1');
        res.json({ ...SETTINGS_DEFAULTS, ...(rows[0] || {}) });
    } catch (err) {
        console.error(err);
        res.json(SETTINGS_DEFAULTS);
    }
});

app.post('/api/settings', requireAdmin, async (req, res) => {
    const {
        contactPhone, contactEmail, whatsappNumber,
        instagramUrl, tiktokUrl, facebookUrl, youtubeUrl,
    } = req.body;
    try {
        await db.query(
            `INSERT INTO platform_settings (id, contact_phone, contact_email, whatsapp_number, instagram_url, tiktok_url, facebook_url, youtube_url)
             VALUES (1, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE contact_phone=VALUES(contact_phone), contact_email=VALUES(contact_email),
               whatsapp_number=VALUES(whatsapp_number), instagram_url=VALUES(instagram_url), tiktok_url=VALUES(tiktok_url),
               facebook_url=VALUES(facebook_url), youtube_url=VALUES(youtube_url)`,
            [contactPhone || null, contactEmail || null, whatsappNumber || null, instagramUrl || null, tiktokUrl || null, facebookUrl || null, youtubeUrl || null]
        );
        await logActivity(req.user.id, 'settings_updated', 'settings', 'Paramètres de la plateforme', {});
        res.json({ message: 'Settings saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- AUTH ROUTES ---------------- */

// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !/^\S+@\S+\.\S+$/.test(email) || !password || password.length < 8) {
        return res.status(400).json({ message: 'Valid username, email and a password of at least 8 characters are required' });
    }

    try {
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Registration always creates a plain 'user' - admin accounts are provisioned out-of-band.
        const [result] = await db.query(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('LOGIN ERROR:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Student login
app.post('/api/students/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    try {
        const [students] = await db.query('SELECT * FROM students WHERE username = ?', [username]);
        const student = students[0];

        if (!student || student.status !== 'active' || !student.password_hash) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, student.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: student.id, role: 'student' }, JWT_SECRET, { expiresIn: '1d' });
        delete student.password_hash;

        res.json({ token, user: student });
    } catch (err) {
        console.error('STUDENT LOGIN ERROR:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Current session - lets the frontend verify a stored token is still valid server-side
app.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            const [rows] = await db.query(
                'SELECT id, name, username, email, grade, join_date, status, avatar_url, package FROM students WHERE id = ?',
                [req.user.id]
            );
            if (!rows[0] || rows[0].status !== 'active') return res.status(401).json({ message: 'Unauthorized' });
            return res.json({ role: 'student', ...rows[0] });
        }
        const [rows] = await db.query('SELECT id, username, email, role FROM users WHERE id = ?', [req.user.id]);
        if (!rows[0]) return res.status(401).json({ message: 'Unauthorized' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- USERS ROUTES (admin "Utilisateurs & rôles" module) ---------------- */
app.get('/api/users', requireAdmin, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at ASC');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/users', requireAdmin, async (req, res) => {
    const { id, username, email, password, role } = req.body;
    const isUpdate = id && /^\d+$/.test(String(id));
    const nextRole = role === 'admin' ? 'admin' : 'user';

    if (!isUpdate && (!username || !email || !password)) {
        return res.status(400).json({ message: 'Username, email and password are required' });
    }

    try {
        if (isUpdate) {
            if (nextRole !== 'admin') {
                const [[{ adminCount }]] = await db.query("SELECT COUNT(*) AS adminCount FROM users WHERE role = 'admin'");
                const [[current]] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
                if (current?.role === 'admin' && adminCount <= 1) {
                    return res.status(400).json({ message: 'Impossible de rétrograder le dernier administrateur' });
                }
            }
            if (password) {
                const hash = await bcrypt.hash(password, 10);
                await db.query('UPDATE users SET username=?, email=?, password_hash=?, role=? WHERE id=?', [username, email, hash, nextRole, id]);
            } else {
                await db.query('UPDATE users SET username=?, email=?, role=? WHERE id=?', [username, email, nextRole, id]);
            }
            await logActivity(req.user.id, 'user_updated', 'user', username || email, { role: nextRole });
            res.json({ id: Number(id), message: 'User updated' });
        } else {
            const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });
            const hash = await bcrypt.hash(password, 10);
            const [result] = await db.query(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [username, email, hash, nextRole]
            );
            await logActivity(req.user.id, 'user_created', 'user', username, { role: nextRole });
            res.status(201).json({ id: result.insertId, message: 'User created' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/users/:id', requireAdmin, async (req, res) => {
    try {
        const [[target]] = await db.query('SELECT role FROM users WHERE id = ?', [req.params.id]);
        if (target?.role === 'admin') {
            const [[{ adminCount }]] = await db.query("SELECT COUNT(*) AS adminCount FROM users WHERE role = 'admin'");
            if (adminCount <= 1) return res.status(400).json({ message: 'Impossible de supprimer le dernier administrateur' });
        }
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- UPLOAD CONFIGURATION ---------------- */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Documents (PDF/DOC/DOCX, e.g. Bibliothèque resources) and videos (course
// module videos) get their own subdirectory, extension whitelist and size
// cap — mirrors server-php/index.php's /api/upload handler.
const UPLOAD_KINDS = {
    document: { dir: 'uploads/documents', extensions: ['.pdf', '.doc', '.docx'], maxBytes: 20 * 1024 * 1024 },
    video: { dir: 'uploads/videos', extensions: ['.mp4', '.webm', '.mov'], maxBytes: 500 * 1024 * 1024 },
};

for (const { dir } of Object.values(UPLOAD_KINDS)) {
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const kind = UPLOAD_KINDS[req.query.kind] ? req.query.kind : 'document';
        cb(null, UPLOAD_KINDS[kind].dir);
    },
    filename: (req, file, cb) => {
        const kind = UPLOAD_KINDS[req.query.kind] ? req.query.kind : 'document';
        cb(null, `${kind}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const kind = UPLOAD_KINDS[req.query.kind] ? req.query.kind : 'document';
        const ext = path.extname(file.originalname).toLowerCase();
        if (UPLOAD_KINDS[kind].extensions.includes(ext)) return cb(null, true);
        cb(new Error('Type de fichier non autorisé'));
    }
}).single('file');

app.use('/api/uploads', express.static('uploads'));

/* ---------------- POSTS ROUTES ---------------- */

// Upload Endpoint (admin only) — ?kind=document (default) or ?kind=video
app.post('/api/upload', requireAdmin, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file selected!' });
        }
        const kind = UPLOAD_KINDS[req.query.kind] ? req.query.kind : 'document';
        if (req.file.size > UPLOAD_KINDS[kind].maxBytes) {
            fs.unlink(req.file.path, () => {});
            return res.status(400).json({ message: 'Fichier trop volumineux' });
        }
        res.status(201).json({
            message: 'File uploaded',
            url: `/api/uploads/${kind === 'video' ? 'videos' : 'documents'}/${req.file.filename}`,
            size: req.file.size,
        });
    });
});

// Get all posts - public
app.get('/api/posts', async (req, res) => {
    try {
        const [posts] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(posts.map((p) => ({ ...p, sections: parseJsonField(p.sections, null) })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create post - admin only
app.post('/api/posts', requireAdmin, async (req, res) => {
    const { title, content, excerpt, category, image, file_url, content_type } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO posts (title, content, excerpt, image_url, file_url, content_type) VALUES (?, ?, ?, ?, ?, ?)',
            [title, content, excerpt, image, file_url, content_type || 'html']
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete post - admin only
app.delete('/api/posts/:id', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- STUDENTS ROUTES (admin only) ---------------- */
app.get('/api/students', requireAdmin, async (req, res) => {
    try {
        const [students] = await db.query(
            'SELECT id, name, username, email, grade, join_date, status, avatar_url, package, coach_name FROM students ORDER BY join_date DESC'
        );
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

const VALID_PACKAGES = ['essentiel', 'boost', 'premium'];
const normalizePackage = (pkg) => (VALID_PACKAGES.includes(pkg) ? pkg : null);

// Resolves a coachId into {coachId, coachName}: coach_name is kept as a
// denormalized label for any reader still on the free-text field. A missing/
// unknown coachId clears the assignment; coachId omitted entirely leaves the
// legacy coachName body field as a fallback (back-compat with old callers).
async function resolveCoach(coachId, fallbackName) {
    if (coachId === undefined) return { coachId: undefined, coachName: fallbackName || null };
    if (!coachId) return { coachId: null, coachName: null };
    const [rows] = await db.query('SELECT id, name FROM coaches WHERE id = ?', [coachId]);
    if (!rows[0]) return { coachId: null, coachName: null };
    return { coachId: rows[0].id, coachName: rows[0].name };
}

app.post('/api/students', requireAdmin, async (req, res) => {
    const { id, name, username, email, grade, status, avatar, password } = req.body;
    const pkg = normalizePackage(req.body.package);
    const isUpdate = id && /^\d+$/.test(String(id));
    const { coachId, coachName } = await resolveCoach(req.body.coachId, req.body.coachName);

    try {
        if (isUpdate) {
            const [existingRows] = await db.query('SELECT status, package, coach_id FROM students WHERE id = ?', [id]);
            const existing = existingRows[0];
            const nextCoachId = coachId === undefined ? existing?.coach_id ?? null : coachId;

            if (password) {
                const hash = await bcrypt.hash(password, 10);
                await db.query(
                    'UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=?, password_hash=?, package=?, coach_name=?, coach_id=? WHERE id=?',
                    [name, username, email, grade, status, avatar, hash, pkg, coachName, nextCoachId, id]
                );
            } else {
                await db.query(
                    'UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=?, package=?, coach_name=?, coach_id=? WHERE id=?',
                    [name, username, email, grade, status, avatar, pkg, coachName, nextCoachId, id]
                );
            }

            if (existing && existing.package !== pkg) {
                await logActivity(req.user.id, 'package_changed', 'student', name, { from: existing.package, to: pkg });
            }
            if (existing && existing.status !== status) {
                await logActivity(req.user.id, 'status_changed', 'student', name, { from: existing.status, to: status });
            }

            res.json({ id: Number(id), message: 'Student updated' });
        } else {
            const hash = password ? await bcrypt.hash(password, 10) : null;
            const [result] = await db.query(
                'INSERT INTO students (name, username, email, grade, status, avatar_url, password_hash, package, coach_name, coach_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [name, username, email, grade, status, avatar, hash, pkg, coachName, coachId ?? null]
            );
            await logActivity(req.user.id, 'student_created', 'student', name, { package: pkg });
            res.status(201).json({ id: result.insertId, message: 'Student created' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- NOTIFICATIONS ROUTES (admin "Notifications" module) ---------------- */
// One row per recipient; a broadcast is fanned out to N rows at creation time.
app.post('/api/notifications', requireAdmin, async (req, res) => {
    const title = (req.body.title || '').trim();
    const message = (req.body.message || '').trim();
    const target = req.body.target || {};
    if (!title || !message) return res.status(400).json({ message: 'Title and message are required' });

    try {
        let studentIds = [];
        if (target.studentId) {
            studentIds = [Number(target.studentId)];
        } else if (target.package) {
            const [rows] = await db.query("SELECT id FROM students WHERE status = 'active' AND package = ?", [target.package]);
            studentIds = rows.map((r) => r.id);
        } else if (target.all) {
            const [rows] = await db.query("SELECT id FROM students WHERE status = 'active'");
            studentIds = rows.map((r) => r.id);
        }
        if (studentIds.length === 0) return res.status(400).json({ message: 'No matching recipients' });

        const values = studentIds.map((id) => [id, title, message]);
        await db.query('INSERT INTO notifications (student_id, title, message) VALUES ?', [values]);
        await logActivity(req.user.id, 'notification_sent', 'notification', title, { recipients: studentIds.length });
        res.status(201).json({ message: 'Notification sent', recipients: studentIds.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/notifications', requireStudent, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notifications WHERE student_id = ? ORDER BY created_at DESC LIMIT 50', [req.user.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/notifications/:id/read', requireStudent, async (req, res) => {
    try {
        await db.query('UPDATE notifications SET read_at = NOW() WHERE id = ? AND student_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/notifications', requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT title, message, created_at, COUNT(*) AS recipient_count, SUM(read_at IS NOT NULL) AS read_count
             FROM notifications GROUP BY title, message, created_at ORDER BY created_at DESC LIMIT 50`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- TOOL OPTIONS ROUTES (admin "Outils" module) ---------------- */
app.get('/api/tool-options', authenticate, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tool_options ORDER BY category ASC, position ASC, id ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/tool-options', requireAdmin, async (req, res) => {
    const { id, category, label, position = 0 } = req.body;
    const isUpdate = id && /^\d+$/.test(String(id));
    if (!['subject', 'technique'].includes(category) || !label || !String(label).trim()) {
        return res.status(400).json({ message: 'Category and label are required' });
    }

    try {
        if (isUpdate) {
            await db.query('UPDATE tool_options SET category=?, label=?, position=? WHERE id=?', [category, label, position, id]);
            res.json({ id: Number(id), message: 'Tool option updated' });
        } else {
            const [result] = await db.query(
                'INSERT INTO tool_options (category, label, position) VALUES (?, ?, ?)',
                [category, label, position]
            );
            res.status(201).json({ id: result.insertId, message: 'Tool option created' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/tool-options/:id', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM tool_options WHERE id = ?', [req.params.id]);
        res.json({ message: 'Tool option deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- COACHES ROUTES ---------------- */
app.get('/api/coaches', authenticate, async (req, res) => {
    try {
        const [coaches] = await db.query(
            `SELECT c.*, COUNT(s.id) AS student_count
             FROM coaches c LEFT JOIN students s ON s.coach_id = c.id AND s.status = 'active'
             GROUP BY c.id ORDER BY c.name ASC`
        );
        res.json(coaches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/coaches', requireAdmin, async (req, res) => {
    const { id, name, email, phone, specialty, status = 'active' } = req.body;
    const isUpdate = id && /^\d+$/.test(String(id));
    if (!name || !String(name).trim()) return res.status(400).json({ message: 'Name required' });

    try {
        if (isUpdate) {
            await db.query(
                'UPDATE coaches SET name=?, email=?, phone=?, specialty=?, status=? WHERE id=?',
                [name, email || null, phone || null, specialty || null, status, id]
            );
            // Keep the denormalized students.coach_name label in sync.
            await db.query('UPDATE students SET coach_name = ? WHERE coach_id = ?', [name, id]);
            res.json({ id: Number(id), message: 'Coach updated' });
        } else {
            const [result] = await db.query(
                'INSERT INTO coaches (name, email, phone, specialty, status) VALUES (?, ?, ?, ?, ?)',
                [name, email || null, phone || null, specialty || null, status]
            );
            await logActivity(req.user.id, 'coach_created', 'coach', name, {});
            res.status(201).json({ id: result.insertId, message: 'Coach created' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/coaches/:id', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM coaches WHERE id = ?', [req.params.id]);
        res.json({ message: 'Coach deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/coaches-overview', requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.id AS coach_id, c.name, c.specialty, c.status,
                COUNT(DISTINCT s.id) AS student_count,
                COUNT(DISTINCT CASE WHEN a.category = 'coaching' AND a.date > (NOW() - INTERVAL 30 DAY) THEN a.id END) AS sessions_last_30d
             FROM coaches c
             LEFT JOIN students s ON s.coach_id = c.id AND s.status = 'active'
             LEFT JOIN appointments a ON a.student_id = s.id
             GROUP BY c.id ORDER BY c.name ASC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/students/:id', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- APPOINTMENTS ROUTES (admin only) ---------------- */
app.get('/api/appointments', requireAdmin, async (req, res) => {
    try {
        const [appointments] = await db.query('SELECT * FROM appointments ORDER BY date DESC');
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/appointments/:id', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/appointments', requireAdmin, async (req, res) => {
    const { id } = req.body;
    const isUpdate = id && /^\d+$/.test(String(id));

    try {
        if (isUpdate) {
            const [existingRows] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
            const existing = existingRows[0];
            if (!existing) return res.status(404).json({ message: 'Appointment not found' });

            const studentName = req.body.studentName ?? existing.student_name;
            const title = req.body.title ?? existing.title;
            const date = req.body.date ?? existing.date;
            const time = req.body.time ?? existing.time;
            const status = req.body.status ?? existing.status;
            const type = req.body.type ?? existing.type;
            const studentId = 'studentId' in req.body ? req.body.studentId : existing.student_id;
            const category = 'category' in req.body ? req.body.category : existing.category;
            const notes = 'notes' in req.body ? req.body.notes : existing.notes;

            await db.query(
                'UPDATE appointments SET student_name=?, title=?, date=?, time=?, status=?, type=?, student_id=?, category=?, notes=? WHERE id=?',
                [studentName, title, date, time, status, type, studentId || null, category || null, notes, id]
            );
            if (existing.status !== status) {
                await logActivity(req.user.id, 'appointment_status_changed', 'appointment', title, { student: studentName, from: existing.status, to: status });
            }
            return res.json({ id: Number(id), message: 'Appointment updated' });
        }

        const { studentName, title, date, time, status = 'confirmed', type = 'live', studentId = null, category = null, notes = null } = req.body;
        const [result] = await db.query(
            'INSERT INTO appointments (student_name, title, date, time, status, type, student_id, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [studentName, title, date, time, status, type, studentId || null, category || null, notes]
        );
        await logActivity(req.user.id, 'appointment_created', 'appointment', title, { student: studentName, date, time });
        res.status(201).json({ id: result.insertId, message: 'Appointment created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/activity', requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, actor_name, action, entity_type, entity_label, meta, created_at FROM activity_log ORDER BY created_at DESC LIMIT 30'
        );
        res.json(rows.map((r) => ({ ...r, meta: parseJsonField(r.meta, null) })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- STORIES ROUTES (public - shown on the homepage) ---------------- */
app.get('/api/stories', async (req, res) => {
    try {
        const [stories] = await db.query('SELECT * FROM success_stories ORDER BY created_at DESC');
        res.json(stories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/stories', requireAdmin, async (req, res) => {
    const { studentName, grade, storyText, avatar } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO success_stories (student_name, grade, story_text, avatar_url) VALUES (?, ?, ?, ?)',
            [studentName, grade, storyText, avatar]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- CONTACT MESSAGES ROUTES ---------------- */
app.get('/api/messages', requireAdmin, async (req, res) => {
    try {
        const [messages] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/messages', async (req, res) => {
    const { name, email, phone, type, message } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO contact_messages (name, email, phone, type, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, type, message]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- COACHING REQUESTS ROUTES ---------------- */
app.get('/api/coaching-requests', requireAdmin, async (req, res) => {
    try {
        const [requests] = await db.query('SELECT * FROM coaching_requests ORDER BY created_at DESC');
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/coaching-requests', async (req, res) => {
    const { name, phone, grade } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO coaching_requests (name, phone, grade) VALUES (?, ?, ?)',
            [name, phone, grade]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- ORIENTATION REQUESTS ROUTES ---------------- */
app.get('/api/orientation-requests', requireAdmin, async (req, res) => {
    try {
        const [requests] = await db.query('SELECT * FROM orientation_requests ORDER BY created_at DESC');
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/orientation-requests', async (req, res) => {
    const { name, phone, filiere, city, bacYear, regionalGrade, pack } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO orientation_requests (name, phone, filiere, city, bac_year, regional_grade, pack) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, phone, filiere, city, bacYear, regionalGrade, pack]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- SELF-GUIDED PLAN ROUTES (Mon Plan) ---------------- */
app.get('/api/plan', requireStudentOrAdmin, async (req, res) => {
    const studentId = resolveStudentId(req, res);
    if (studentId === null) return;
    try {
        const [rows] = await db.query('SELECT * FROM self_guided_plans WHERE student_id = ?', [studentId]);
        const plan = rows[0];
        if (!plan) return res.json(null);
        res.json({ ...plan, actions: parseJsonField(plan.actions, []), habits: parseJsonField(plan.habits, []) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/plan', requireStudent, async (req, res) => {
    const { objective, startDate, obstacles, actions, habits } = req.body;
    try {
        await db.query(
            `INSERT INTO self_guided_plans (student_id, objective, start_date, obstacles, actions, habits)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE objective=VALUES(objective), start_date=VALUES(start_date),
               obstacles=VALUES(obstacles), actions=VALUES(actions), habits=VALUES(habits)`,
            [req.user.id, objective || '', startDate || '', obstacles || '', JSON.stringify(actions || []), JSON.stringify(habits || [])]
        );
        res.json({ message: 'Plan saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- GOALS ROUTES (Objectifs, in Mes outils) ---------------- */
app.get('/api/goals', requireStudentOrAdmin, async (req, res) => {
    const studentId = resolveStudentId(req, res);
    if (studentId === null) return;
    try {
        const [rows] = await db.query('SELECT * FROM goals WHERE student_id = ? ORDER BY created_at DESC', [studentId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/goals', requireStudent, async (req, res) => {
    const { id, title, category, targetDate, progress, status, nextAction } = req.body;
    try {
        if (id) {
            await db.query(
                'UPDATE goals SET title=?, category=?, target_date=?, progress=?, status=?, next_action=? WHERE id=? AND student_id=?',
                [title, category, targetDate || null, progress ?? 0, status, nextAction || null, id, req.user.id]
            );
            return res.json({ id: Number(id), message: 'Goal updated' });
        }
        const [result] = await db.query(
            'INSERT INTO goals (student_id, title, category, target_date, progress, status, next_action) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, title, category, targetDate || null, progress ?? 0, status || 'a_demarrer', nextAction || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Goal created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/goals/:id', requireStudent, async (req, res) => {
    try {
        await db.query('DELETE FROM goals WHERE id = ? AND student_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Goal deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- REVISION SESSIONS ROUTES (Suivi des révisions) ---------------- */
app.get('/api/revisions', requireStudentOrAdmin, async (req, res) => {
    const studentId = resolveStudentId(req, res);
    if (studentId === null) return;
    try {
        const [rows] = await db.query('SELECT * FROM revision_sessions WHERE student_id = ? ORDER BY session_date DESC', [studentId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/revisions', requireStudent, async (req, res) => {
    const { subject, chapter, durationMin, technique, understanding } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO revision_sessions (student_id, subject, chapter, duration_min, technique, understanding) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, subject, chapter || null, durationMin || 0, technique || null, understanding || 3]
        );
        res.status(201).json({ id: result.insertId, message: 'Revision session created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/revisions/:id', requireStudent, async (req, res) => {
    try {
        await db.query('DELETE FROM revision_sessions WHERE id = ? AND student_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Revision session deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- HABITS ROUTES (Habit tracker) ---------------- */
app.get('/api/habits', requireStudentOrAdmin, async (req, res) => {
    const studentId = resolveStudentId(req, res);
    if (studentId === null) return;
    try {
        const [rows] = await db.query('SELECT * FROM habits WHERE student_id = ? ORDER BY created_at ASC', [studentId]);
        res.json(rows.map((r) => ({ ...r, days: parseJsonField(r.days, [false, false, false, false, false, false, false]) })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/habits', requireStudent, async (req, res) => {
    const { id, name, days } = req.body;
    try {
        if (id) {
            await db.query('UPDATE habits SET name=?, days=? WHERE id=? AND student_id=?', [name, JSON.stringify(days), id, req.user.id]);
            return res.json({ id: Number(id), message: 'Habit updated' });
        }
        const [result] = await db.query(
            'INSERT INTO habits (student_id, name, days) VALUES (?, ?, ?)',
            [req.user.id, name, JSON.stringify(days || [false, false, false, false, false, false, false])]
        );
        res.status(201).json({ id: result.insertId, message: 'Habit created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/habits/:id', requireStudent, async (req, res) => {
    try {
        await db.query('DELETE FROM habits WHERE id = ? AND student_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- CHECK-INS ROUTES ---------------- */
app.get('/api/checkins', requireStudentOrAdmin, async (req, res) => {
    const studentId = resolveStudentId(req, res);
    if (studentId === null) return;
    try {
        const [rows] = await db.query('SELECT * FROM checkins WHERE student_id = ? ORDER BY created_at DESC', [studentId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/checkins', requireStudent, async (req, res) => {
    const { adherence, daysRespected, obstacle, concentration, success, needsAdjustment } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO checkins (student_id, adherence, days_respected, obstacle, concentration, success, needs_adjustment) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, adherence, daysRespected, obstacle || null, concentration, success || null, !!needsAdjustment]
        );
        await logActivity(req.user.id, 'checkin_submitted', 'checkin', `Check-in`, { adherence, daysRespected });
        res.status(201).json({ id: result.insertId, message: 'Check-in created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- TIMETABLE ROUTES (Mon planning) ---------------- */
app.get('/api/timetable', requireStudentOrAdmin, async (req, res) => {
    const studentId = resolveStudentId(req, res);
    if (studentId === null) return;
    try {
        const [rows] = await db.query('SELECT * FROM timetable_tasks WHERE student_id = ? ORDER BY created_at ASC', [studentId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/timetable', requireStudent, async (req, res) => {
    const { subject, day, startTime, endTime } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO timetable_tasks (student_id, subject, day, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, subject, day, startTime, endTime]
        );
        res.status(201).json({ id: result.insertId, message: 'Timetable task created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/timetable/:id', requireStudent, async (req, res) => {
    try {
        await db.query('DELETE FROM timetable_tasks WHERE id = ? AND student_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Timetable task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- RESOURCES ROUTES (GET: any authenticated user, write: admin only) ---------------- */
app.get('/api/resources', authenticate, async (req, res) => {
    try {
        const [resources] = await db.query('SELECT * FROM resources ORDER BY created_at DESC');
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/resources', requireAdmin, async (req, res) => {
    const { title, type, url, subject, fileSize, iconName } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO resources (title, type, url, subject, file_size, icon_name) VALUES (?, ?, ?, ?, ?, ?)',
            [title, type || 'summary', url, subject, fileSize || null, iconName || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Resource created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/resources/:id', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM resources WHERE id = ?', [req.params.id]);
        res.json({ message: 'Resource deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- COURSE MODULES ROUTES ("Mes contenus") ---------------- */
app.get('/api/course-modules', authenticate, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM course_modules ORDER BY position ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/course-modules/:id', requireAdmin, async (req, res) => {
    let { videoUrl, videoSource } = req.body;
    if (!['link', 'upload'].includes(videoSource)) videoSource = null;
    if (videoUrl === '') { videoUrl = null; videoSource = null; }
    try {
        await db.query('UPDATE course_modules SET video_url = ?, video_source = ? WHERE id = ?', [videoUrl || null, videoSource, req.params.id]);
        res.json({ id: Number(req.params.id), message: 'Module updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin creates a new module (title + description); slug is derived from the
// insert id so it stays unique without the admin having to pick one.
app.post('/api/course-modules', requireAdmin, async (req, res) => {
    const title = (req.body.title || '').trim();
    const description = req.body.description || null;
    if (!title) return res.status(400).json({ message: 'Title required' });
    try {
        const [maxRows] = await db.query('SELECT COALESCE(MAX(position), 0) AS maxPos FROM course_modules');
        const position = (maxRows[0]?.maxPos || 0) + 1;
        const tempSlug = `custom-${Date.now()}`;
        const [result] = await db.query(
            'INSERT INTO course_modules (slug, title, description, position) VALUES (?, ?, ?, ?)',
            [tempSlug, title, description, position]
        );
        const slug = `custom-${result.insertId}`;
        await db.query('UPDATE course_modules SET slug = ? WHERE id = ?', [slug, result.insertId]);
        res.status(201).json({
            id: result.insertId, slug, title, description, position,
            video_url: null, video_source: null, message: 'Module created',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/course-modules/:id/details', requireAdmin, async (req, res) => {
    const title = (req.body.title || '').trim();
    const description = req.body.description || null;
    if (!title) return res.status(400).json({ message: 'Title required' });
    try {
        await db.query('UPDATE course_modules SET title = ?, description = ? WHERE id = ?', [title, description, req.params.id]);
        res.json({ id: Number(req.params.id), message: 'Module updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/course-modules/:id', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM course_modules WHERE id = ?', [req.params.id]);
        res.json({ message: 'Module deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- COACHING SESSIONS (appointments filtered to category='coaching') ---------------- */
// Student sees only their own; admin sees all (or one student via ?studentId=).
app.get('/api/coaching-sessions', requireStudentOrAdmin, async (req, res) => {
    try {
        let rows;
        if (req.user.role === 'student') {
            [rows] = await db.query(
                "SELECT a.* FROM appointments a WHERE a.category = 'coaching' AND a.student_id = ? ORDER BY a.date DESC",
                [req.user.id]
            );
        } else if (req.query.studentId) {
            [rows] = await db.query(
                "SELECT a.*, s.name AS student_full_name FROM appointments a LEFT JOIN students s ON a.student_id = s.id WHERE a.category = 'coaching' AND a.student_id = ? ORDER BY a.date DESC",
                [Number(req.query.studentId)]
            );
        } else {
            [rows] = await db.query(
                "SELECT a.*, s.name AS student_full_name FROM appointments a LEFT JOIN students s ON a.student_id = s.id WHERE a.category = 'coaching' ORDER BY a.date DESC"
            );
        }
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- FEEDBACK (coach/admin messages to a student) ---------------- */
app.get('/api/feedback', requireStudentOrAdmin, async (req, res) => {
    const studentId = resolveStudentId(req, res);
    if (studentId === null) return;
    try {
        const [rows] = await db.query('SELECT * FROM feedback WHERE student_id = ? ORDER BY created_at DESC', [studentId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/feedback', requireAdmin, async (req, res) => {
    const { studentId, appointmentId } = req.body;
    const message = (req.body.message || '').trim();
    if (!studentId || message === '') {
        return res.status(400).json({ message: 'studentId and message are required' });
    }
    try {
        const [students] = await db.query('SELECT name FROM students WHERE id = ?', [studentId]);
        const studentName = students[0]?.name;
        if (!studentName) return res.status(404).json({ message: 'Student not found' });

        const [users] = await db.query('SELECT username FROM users WHERE id = ?', [req.user.id]);
        const authorName = users[0]?.username || 'Admin';

        const [result] = await db.query(
            'INSERT INTO feedback (student_id, appointment_id, message, author_name) VALUES (?, ?, ?, ?)',
            [studentId, appointmentId || null, message, authorName]
        );
        await logActivity(req.user.id, 'feedback_sent', 'feedback', studentName, { message: message.slice(0, 120) });
        res.status(201).json({ id: result.insertId, message: 'Feedback sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/feedback', requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT f.*, s.name, s.username FROM feedback f JOIN students s ON f.student_id = s.id ORDER BY f.created_at DESC LIMIT 200'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- ADMIN CROSS-STUDENT OVERVIEWS (Plans, Check-ins, Progression) ---------------- */
app.get('/api/admin/plans', requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT s.id AS student_id, s.name, s.username, p.objective, p.start_date, p.obstacles, p.actions, p.habits, p.updated_at
             FROM students s LEFT JOIN self_guided_plans p ON p.student_id = s.id
             WHERE s.status = 'active' ORDER BY s.name ASC`
        );
        res.json(rows.map((r) => ({ ...r, actions: parseJsonField(r.actions, []), habits: parseJsonField(r.habits, []) })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/checkins', requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT c.*, s.name, s.username FROM checkins c JOIN students s ON c.student_id = s.id ORDER BY c.created_at DESC LIMIT 200'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/progress-overview', requireAdmin, async (req, res) => {
    try {
        const [students] = await db.query("SELECT id, name, username, package FROM students WHERE status = 'active'");

        const plans = {};
        const [planRows] = await db.query('SELECT student_id, actions FROM self_guided_plans');
        for (const row of planRows) {
            const actions = parseJsonField(row.actions, []);
            plans[row.student_id] = { total: actions.length, done: actions.filter((a) => !!a?.done).length };
        }

        const goals = {};
        const [goalRows] = await db.query(
            "SELECT student_id, COUNT(*) AS total, SUM(status = 'atteint') AS atteints FROM goals GROUP BY student_id"
        );
        for (const row of goalRows) {
            goals[row.student_id] = { total: Number(row.total), atteints: Number(row.atteints) };
        }

        const revisions = {};
        const [revisionRows] = await db.query(
            'SELECT student_id, COUNT(*) AS recent FROM revision_sessions WHERE session_date > (NOW() - INTERVAL 7 DAY) GROUP BY student_id'
        );
        for (const row of revisionRows) {
            revisions[row.student_id] = Number(row.recent);
        }

        const habits = {};
        const [habitRows] = await db.query('SELECT student_id, days FROM habits');
        for (const row of habitRows) {
            const daysDone = parseJsonField(row.days, []).filter(Boolean).length;
            if (!habits[row.student_id]) habits[row.student_id] = { count: 0, daysDone: 0 };
            habits[row.student_id].count++;
            habits[row.student_id].daysDone += daysDone;
        }

        const overview = students.map((s) => {
            const plan = plans[s.id] || { total: 0, done: 0 };
            const goal = goals[s.id] || { total: 0, atteints: 0 };
            const habit = habits[s.id] || { count: 0, daysDone: 0 };
            return {
                studentId: s.id,
                name: s.name,
                username: s.username,
                package: s.package,
                planActionsTotal: plan.total,
                planActionsDone: plan.done,
                goalsTotal: goal.total,
                goalsAtteints: goal.atteints,
                revisionsLast7d: revisions[s.id] || 0,
                habitCount: habit.count,
                habitConsistencyPct: habit.count > 0 ? Math.round((habit.daysDone / (habit.count * 7)) * 100) : null,
            };
        });

        res.json(overview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- COLLECTIVE SESSIONS (Sessions collectives) ---------------- */
app.get('/api/collective-sessions', authenticate, async (req, res) => {
    try {
        let rows;
        if (req.user.role === 'student') {
            [rows] = await db.query(
                `SELECT cs.*,
                    (SELECT COUNT(*) FROM collective_session_registrations r WHERE r.session_id = cs.id) AS registered_count,
                    EXISTS(SELECT 1 FROM collective_session_registrations r WHERE r.session_id = cs.id AND r.student_id = ?) AS my_registration
                 FROM collective_sessions cs WHERE cs.status != 'cancelled' ORDER BY cs.date ASC`,
                [req.user.id]
            );
        } else {
            [rows] = await db.query(
                `SELECT cs.*,
                    (SELECT COUNT(*) FROM collective_session_registrations r WHERE r.session_id = cs.id) AS registered_count
                 FROM collective_sessions cs ORDER BY cs.date ASC`
            );
        }
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/collective-sessions', requireAdmin, async (req, res) => {
    const { id, title, description, date, time, capacity, meetingLink, status } = req.body;
    try {
        if (id) {
            await db.query(
                'UPDATE collective_sessions SET title=?, description=?, date=?, time=?, capacity=?, meeting_link=?, status=? WHERE id=?',
                [title, description || null, date, time, capacity || null, meetingLink || null, status || 'scheduled', id]
            );
            res.json({ id: Number(id), message: 'Session updated' });
        } else {
            const [result] = await db.query(
                'INSERT INTO collective_sessions (title, description, date, time, capacity, meeting_link, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, description || null, date, time, capacity || null, meetingLink || null, status || 'scheduled']
            );
            await logActivity(req.user.id, 'collective_session_created', 'collective_session', title, { date, time });
            res.status(201).json({ id: result.insertId, message: 'Session created' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/collective-sessions/:id', requireAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM collective_sessions WHERE id = ?', [req.params.id]);
        res.json({ message: 'Session deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/collective-sessions/:id/registrations', requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT r.*, s.name, s.username FROM collective_session_registrations r JOIN students s ON r.student_id = s.id WHERE r.session_id = ? ORDER BY r.registered_at ASC',
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/collective-sessions/:id/register', requireStudent, async (req, res) => {
    const sessionId = Number(req.params.id);
    try {
        const [sessions] = await db.query(
            `SELECT capacity, (SELECT COUNT(*) FROM collective_session_registrations WHERE session_id = ?) AS registered
             FROM collective_sessions WHERE id = ?`,
            [sessionId, sessionId]
        );
        const session = sessions[0];
        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.capacity !== null && Number(session.registered) >= Number(session.capacity)) {
            return res.status(400).json({ message: 'Session complète' });
        }

        await db.query('INSERT INTO collective_session_registrations (session_id, student_id) VALUES (?, ?)', [sessionId, req.user.id]);
        res.status(201).json({ message: 'Registered' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ message: 'Already registered' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/collective-sessions/:id/register', requireStudent, async (req, res) => {
    try {
        await db.query('DELETE FROM collective_session_registrations WHERE session_id = ? AND student_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Unregistered' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/collective-sessions/:id/attendance', requireAdmin, async (req, res) => {
    const { studentId } = req.body;
    const attended = 'attended' in req.body ? !!req.body.attended : null;
    if (!studentId) return res.status(400).json({ message: 'studentId required' });
    try {
        await db.query(
            'UPDATE collective_session_registrations SET attended = ? WHERE session_id = ? AND student_id = ?',
            [attended, req.params.id, studentId]
        );
        res.json({ message: 'Attendance updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
