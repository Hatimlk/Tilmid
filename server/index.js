const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

app.use(cors());
app.use(express.json());

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

/* ---------------- AUTH ROUTES ---------------- */

// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email); // DEBUG

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            console.log('User not found'); // DEBUG
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        console.log('User found:', user.id, user.role); // DEBUG
        console.log('Hash in DB:', user.password_hash); // DEBUG

        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Password match:', isMatch); // DEBUG

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
        console.error('LOGIN ERROR:', err); // DEBUG
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

/* ---------------- UPLOAD CONFIGURATION ---------------- */
const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'file-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Files Only!');
    }
}

// Serve static folder for uploads
app.use('/uploads', express.static('uploads'));


/* ---------------- POSTS ROUTES ---------------- */

// Upload Endpoint
app.post('/api/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
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

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const [posts] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create post
app.post('/api/posts', async (req, res) => {
    // Middleware to verify token should be added here
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

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});




/* ---------------- STUDENTS ROUTES ---------------- */
app.get('/api/students', async (req, res) => {
    try {
        const [students] = await db.query('SELECT * FROM students ORDER BY join_date DESC');
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/students', async (req, res) => {
    const { name, username, email, grade, status, avatar } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO students (name, username, email, grade, status, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, username, email, grade, status, avatar]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ---------------- APPOINTMENTS ROUTES ---------------- */
app.get('/api/appointments', async (req, res) => {
    try {
        const [appointments] = await db.query('SELECT * FROM appointments ORDER BY created_at DESC');
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/appointments', async (req, res) => {
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

/* ---------------- STORIES ROUTES ---------------- */
app.get('/api/stories', async (req, res) => {
    try {
        const [stories] = await db.query('SELECT * FROM success_stories ORDER BY created_at DESC');
        res.json(stories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/stories', async (req, res) => {
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
app.get('/api/messages', async (req, res) => {
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
app.get('/api/coaching-requests', async (req, res) => {
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

/* ---------------- RESOURCES ROUTES ---------------- */
app.get('/api/resources', async (req, res) => {
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

