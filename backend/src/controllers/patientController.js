const queueService = require('../services/queueService');

async function checkIn(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      phone,
      symptoms,
      temp,
      spo2,
      hr
    } = req.body;

    // 1. Basic Validation
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'firstName and lastName are required' });
    }

    // 2. Call the Service (The Brain)
    const result = await queueService.handleCheckIn({
      firstName,
      lastName,
      dateOfBirth,
      phone,
      symptoms,
      temp,
      spo2,
      hr
    });

    // 3. Send Success Response
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkIn
};