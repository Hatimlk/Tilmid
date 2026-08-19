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
                'SELECT id, name, username, email, grade, join_date, status, avatar_url FROM students WHERE id = ?',
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

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'file-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Files Only!'));
    }
}

app.use('/uploads', express.static('uploads'));

/* ---------------- POSTS ROUTES ---------------- */

// Upload Endpoint - requires auth to stop anonymous disk-exhaustion via unlimited uploads
app.post('/api/upload', authenticate, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err.message || 'Upload failed' });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ message: 'No file selected!' });
            } else {
                res.json({
                    message: 'File uploaded!',
                    url: `/uploads/${req.file.filename}`
                });
            }
        }
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
            'SELECT id, name, username, email, grade, join_date, status, avatar_url FROM students ORDER BY join_date DESC'
        );
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/students', requireAdmin, async (req, res) => {
    const { id, name, username, email, grade, status, avatar, password } = req.body;
    const isUpdate = id && /^\d+$/.test(String(id));

    try {
        if (isUpdate) {
            if (password) {
                const hash = await bcrypt.hash(password, 10);
                await db.query(
                    'UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=?, password_hash=? WHERE id=?',
                    [name, username, email, grade, status, avatar, hash, id]
                );
            } else {
                await db.query(
                    'UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=? WHERE id=?',
                    [name, username, email, grade, status, avatar, id]
                );
            }
            res.json({ id: Number(id), message: 'Student updated' });
        } else {
            const hash = password ? await bcrypt.hash(password, 10) : null;
            const [result] = await db.query(
                'INSERT INTO students (name, username, email, grade, status, avatar_url, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, username, email, grade, status, avatar, hash]
            );
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
        const [appointments] = await db.query('SELECT * FROM appointments ORDER BY created_at DESC');
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/appointments', requireAdmin, async (req, res) => {
    const { studentName, title, date, time, status, type } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO appointments (student_name, title, date, time, status, type) VALUES (?, ?, ?, ?, ?, ?)',
            [studentName, title, date, time, status, type]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
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

/* ---------------- RESOURCES ROUTES (any authenticated user) ---------------- */
app.get('/api/resources', authenticate, async (req, res) => {
    try {
        const [resources] = await db.query('SELECT * FROM resources ORDER BY created_at DESC');
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
