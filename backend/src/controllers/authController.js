const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/knex'); // Ensure this path matches your folder structure

// SECURITY NOTE: In a real app, put this key in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_123';

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check if user exists in DB
        const user = await db('users').where({ username }).first();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 2. Compare the password typed with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Generate the "Digital ID Card" (Token)
        // This token contains their ID and Role, and expires in 24 hours
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 4. Send success response
        res.json({
            message: 'Login successful',
            token: token,
            user: { username: user.username, role: user.role }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { login };