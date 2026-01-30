const db = require('./db');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const username = 'Admin User';
    const email = 'admin@tilmid.com';
    const password = 'admin';
    const role = 'admin';

    try {
        console.log(`Hashing password '${password}'...`);
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        console.log('Checking if admin exists...');
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existing.length > 0) {
            console.log('Admin user already exists. Updating password...');
            await db.query('UPDATE users SET password_hash = ?, role = ? WHERE email = ?', [password_hash, role, email]);
            console.log('Admin password updated successfully.');
        } else {
            console.log('Creating new admin user...');
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
