require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const db = require('./db/knex');

async function seedAdmin() {
    // === SETTINGS ===
    const username = 'admin';  
    const plainPassword = '123'; 
    // ================

    try {
        console.log(`1. Deleting old '${username}' if exists...`);
        // FIX: Delete the user first so we can recreate them with the new password
        await db('users').where({ username: username }).del();

        console.log(`2. Hashing new password '${plainPassword}'...`);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        console.log(`3. Creating new user '${username}'...`);
        await db('users').insert({
            username: username,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`SUCCESS! User '${username}' has been reset.`);
        console.log(`New Password: ${plainPassword}`);
        process.exit();

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

seedAdmin();