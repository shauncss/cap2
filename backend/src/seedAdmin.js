require('dotenv').config({ path: '../.env' });

// === ADD THIS DEBUGGING BLOCK ===
console.log("--- DEBUG CONNECTION INFO ---");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("---------------------------");

const bcrypt = require('bcryptjs');
const db = require('./db/knex');

async function seedAdmin() {
    const username = 'admin';
    const plainPassword = 'password123'; // You can change this later

    try {
        console.log("1. Hashing password...");
        // Scramble the password so it's secure
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        console.log("2. Inserting user into database...");
        // Insert into the 'users' table you just confirmed
        await db('users').insert({
            username: username,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`SUCCESS: User '${username}' created!`);
        console.log(`You can now log in with password: ${plainPassword}`);
        process.exit();

    } catch (error) {
        if (error.code === '23505') { // Postgres error code for "Unique Violation"
            console.log("User 'admin' already exists. No need to seed.");
        } else {
            console.error("Error creating user:", error);
        }
        process.exit(1);
    }
}

seedAdmin();