const db = require('../db/knex'); // Database Connection
const socketService = require('../services/socketService');
const queueModel = require('../models/QueueModel'); // Helper model for complex queries

// 1. Add New Patient (The 'Add Ticket' Button)
const addPatient = async (req, res) => {
    const { name, service } = req.body; 

    // Validation
    if (!name) {
        return res.status(400).json({ error: "Patient name is required" });
    }

    try {
        // Insert into Database and return the new row immediately
        const [newTicket] = await db('queue')
            .insert({
                patient_name: name,
                service_type: service || 'General',
                status: 'waiting',
                created_at: new Date()
            })
            .returning('*'); // Required for Postgres to return data

        socketService.emit('queue_update', newTicket);

        res.status(201).json(newTicket);

    } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).json({ error: "Failed to add patient" });
    }
};

// 2. Get Dashboard Stats (Total, Pending, Wait Time)
const getDashboardStats = async (req, res) => {
  try {
    const stats = await queueModel.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Current Queue (For the TV Display)
const getCurrentQueue = async (req, res) => {
  try {
    // Get all 'waiting' or 'serving' patients, ordered by time
    const queue = await db('queue')
        .whereIn('status', ['waiting', 'serving'])
        .orderBy('created_at', 'asc');
    
    res.json({ queue });
  } catch (error) {
    console.error("Error getting queue:", error);
    res.status(500).json({ error: "Failed to fetch queue" });
  }
};

// 4. Get Queue History (Optional/Advanced)
const getHistory = async (req, res) => {
  try {
    const history = await db('queue').orderBy('created_at', 'desc').limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// 5. Get ETA (Optional)
const getEta = async (req, res) => {
    // Placeholder: return 0 if not implemented yet
    res.json({ avgWait: 15, totalWaiting: 5 }); 
};

// === CALL NEXT PATIENT ===
const callNext = async (req, res) => {
  try {
    // 1. Mark the CURRENT patient as 'completed'
    // We update anyone who is currently 'serving' so the room becomes free.
    await db('queue')
      .where({ status: 'serving' })
      .update({ status: 'completed', updated_at: new Date() });

    // 2. Find the NEXT patient in line
    // We look for 'waiting' patients and pick the oldest one (first in line).
    const nextPatient = await db('queue')
      .where({ status: 'waiting' })
      .orderBy('created_at', 'asc') // Oldest first
      .first();

    // 3. If there is someone waiting...
    if (nextPatient) {
      // Change their status to 'serving'
      await db('queue')
        .where({ id: nextPatient.id })
        .update({ status: 'serving', updated_at: new Date() });
      
      socketService.emit('queue_update', nextPatient);
      // Send back who we just called
      res.json({ message: "Next patient called", patient: nextPatient });
    } else {
      // 4. If the queue is empty
      res.json({ message: "Queue is empty", patient: null });
    }

  } catch (error) {
    console.error("Error calling next:", error);
    res.status(500).json({ error: "Failed to call next patient" });
  }
};

// === FINISH CURRENT PATIENT (TAKE A BREAK) ===
const completeCurrent = async (req, res) => {
  try {
    // 1. Find the person currently 'serving' and mark them 'completed'
    // 'updated_at' is important so we know EXACTLY when they finished (for stats)
    const result = await db('queue')
      .where({ status: 'serving' })
      .update({ status: 'completed', updated_at: new Date() });

    // 2. Check if anyone was actually updated
    if (result > 0) {
      socketService.emit('queue_update', null);
      res.json({ message: "Current patient marked as completed." });
    } else {
      res.json({ message: "No active patient to complete." });
    }

  } catch (error) {
    console.error("Error completing patient:", error);
    res.status(500).json({ error: "Failed to complete patient" });
  }
};

module.exports = {
  addPatient,
  getDashboardStats,
  getCurrentQueue,
  getHistory,
  getEta,
  callNext,
  completeCurrent
};