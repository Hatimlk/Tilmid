const db = require('./db');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        console.log('Seeding database...');

        // Check availability
        try {
            await db.query('SELECT 1');
            console.log('Database connected.');
        } catch (e) {
            console.error('Database connection failed:', e.message);
            process.exit(1);
        }

        // Create Admin User
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
        const username = process.env.ADMIN_USERNAME || 'Admin';

        if (!email || !password || password.length < 12) {
            console.error('Set ADMIN_EMAIL and ADMIN_BOOTSTRAP_PASSWORD (12+ chars) in the environment before seeding.');
            process.exit(1);
        }

        // Check if exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            console.log('Admin user already exists.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await db.query(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, 'admin']
            );
            console.log('Admin user created:', email);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
