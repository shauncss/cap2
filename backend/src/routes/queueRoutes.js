const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Debug check (keep this, it's good!)
console.log("Stats Loaded:", !!queueController.getDashboardStats);
console.log("Add Patient Loaded:", !!queueController.addPatient); // <--- Check this one too

// === DEFINING ROUTES ===
router.get('/stats', queueController.getDashboardStats);
router.get('/current', queueController.getCurrentQueue);
router.post('/add', queueController.addPatient); 
router.post('/call-next', queueController.callNext);
router.post('/complete', queueController.completeCurrent);

module.exports = router;