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

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
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
        res.json(posts);
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

app.post('/api/students', requireAdmin, async (req, res) => {
    const { id, name, username, email, grade, status, avatar, password, coachName } = req.body;
    const pkg = normalizePackage(req.body.package);
    const isUpdate = id && /^\d+$/.test(String(id));

    try {
        if (isUpdate) {
            const [existingRows] = await db.query('SELECT status, package FROM students WHERE id = ?', [id]);
            const existing = existingRows[0];

            if (password) {
                const hash = await bcrypt.hash(password, 10);
                await db.query(
                    'UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=?, password_hash=?, package=?, coach_name=? WHERE id=?',
                    [name, username, email, grade, status, avatar, hash, pkg, coachName || null, id]
                );
            } else {
                await db.query(
                    'UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=?, package=?, coach_name=? WHERE id=?',
                    [name, username, email, grade, status, avatar, pkg, coachName || null, id]
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
                'INSERT INTO students (name, username, email, grade, status, avatar_url, password_hash, package, coach_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [name, username, email, grade, status, avatar, hash, pkg, coachName || null]
            );
            await logActivity(req.user.id, 'student_created', 'student', name, { package: pkg });
            res.status(201).json({ id: result.insertId, message: 'Student created' });
        }
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

            await db.query(
                'UPDATE appointments SET student_name=?, title=?, date=?, time=?, status=?, type=? WHERE id=?',
                [studentName, title, date, time, status, type, id]
            );
            if (existing.status !== status) {
                await logActivity(req.user.id, 'appointment_status_changed', 'appointment', title, { student: studentName, from: existing.status, to: status });
            }
            return res.json({ id: Number(id), message: 'Appointment updated' });
        }

        const { studentName, title, date, time, status = 'confirmed', type = 'live' } = req.body;
        const [result] = await db.query(
            'INSERT INTO appointments (student_name, title, date, time, status, type) VALUES (?, ?, ?, ?, ?, ?)',
            [studentName, title, date, time, status, type]
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
        res.json(rows);
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
        res.json(rows[0] || null);
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
        res.json(rows);
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

/* ---------------- ERROR LOG ROUTES (Mon Error Log) ---------------- */
app.get('/api/error-log', requireStudentOrAdmin, async (req, res) => {
    const studentId = resolveStudentId(req, res);
    if (studentId === null) return;
    try {
        const [rows] = await db.query('SELECT * FROM error_log_entries WHERE student_id = ? ORDER BY created_at DESC', [studentId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/error-log', requireStudent, async (req, res) => {
    const { id, subject, topic, mistake, reason, correctMethod, reviewDate, status } = req.body;
    try {
        if (id) {
            await db.query(
                'UPDATE error_log_entries SET subject=?, topic=?, mistake=?, reason=?, correct_method=?, review_date=?, status=? WHERE id=? AND student_id=?',
                [subject, topic || null, mistake, reason || null, correctMethod || null, reviewDate || null, status, id, req.user.id]
            );
            return res.json({ id: Number(id), message: 'Error log entry updated' });
        }
        const [result] = await db.query(
            'INSERT INTO error_log_entries (student_id, subject, topic, mistake, reason, correct_method, review_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, subject, topic || null, mistake, reason || null, correctMethod || null, reviewDate || null, status || 'a_revoir']
        );
        res.status(201).json({ id: result.insertId, message: 'Error log entry created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/error-log/:id', requireStudent, async (req, res) => {
    try {
        await db.query('DELETE FROM error_log_entries WHERE id = ? AND student_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Error log entry deleted' });
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
