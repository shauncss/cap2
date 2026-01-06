const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

// The full URL will be: POST /api/checkin
router.post('/checkin', patientController.checkIn);

module.exports = router;