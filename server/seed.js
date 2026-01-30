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
        const email = 'admin@tilmid.com';
        const password = 'admin';
        const username = 'Admin';

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
            console.log('Admin user created:');
            console.log('Email:', email);
            console.log('Password:', password);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
