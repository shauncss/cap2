require('dotenv').config({ path: '../.env' });

const bcrypt = require('bcryptjs');
const db = require('./db/knex');

async function seedAdmin() {
    // === CHANGE ADMIN ID AND PASSWORD HERE ===
    const username = 'admin';  // Change this to change the ID
    const plainPassword = '123'; // Change this to change the Password
    // =========================================

    try {
        console.log(`1. Hashing password '${plainPassword}'...`);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        console.log(`2. Inserting user '${username}' into database...`);
        
        // This will try to insert. If 'admin' exists, it skips due to the error catch below.
        await db('users').insert({
            username: username,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`SUCCESS: User '${username}' created!`);
        console.log(`You can now log in with password: ${plainPassword}`);
        process.exit();

    } catch (error) {
        if (error.code === '23505') { // Unique Violation
            console.log(`User '${username}' already exists.`);
            console.log("To reset the password, please delete this user from the database first.");
        } else {
            console.error("Error creating user:", error);
        }
        process.exit(1);
    }
}

seedAdmin();