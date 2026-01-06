const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// The Login Endpoint
// Full URL will be: POST http://localhost:5000/api/auth/login
router.post('/login', authController.login);

module.exports = router;