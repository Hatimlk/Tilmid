const db = require('./db');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const username = process.env.ADMIN_USERNAME || 'Admin User';
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    const role = 'admin';

    if (!email || !password || password.length < 12) {
        console.error('Set ADMIN_EMAIL and ADMIN_BOOTSTRAP_PASSWORD (12+ chars) in the environment before running this script.');
        process.exit(1);
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);

        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existing.length > 0) {
            await db.query('UPDATE users SET password_hash = ?, role = ? WHERE email = ?', [password_hash, role, email]);
            console.log('Admin password updated successfully.');
        } else {
            await db.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [username, email, password_hash, role]);
            console.log('Admin user created successfully.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

createAdmin();
