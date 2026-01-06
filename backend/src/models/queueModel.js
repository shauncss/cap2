const db = require('../db/knex');

// 1. Add patient to queue
async function enqueuePatient(data) {
  // We only insert the fields that actually exist in the 'queue' table
  return db('queue').insert({
    patient_id: data.patient_id,
    queue_number: data.queue_number,
    status: data.status
  }).returning('*');
}

// 2. Get the full picture (The Critical Fix)
async function getCurrentQueueSnapshot() {
  // Get the person currently being served
  const current = await db('queue')
    .where({ status: 'serving' })
    .first();

  // Get the list of people waiting
  const waiting = await db('queue')
    .where({ status: 'waiting' })
    .orderBy('created_at', 'asc'); // Oldest first

  // IMPORTANT: If your queue table doesn't have eta_minutes, 
  // we might need to join with patients table. 
  // But for now, let's just return what we have in the queue table.
  
  return {
    current: current || null,
    waiting: waiting || []
  };
}

// 3. Get Queue Length (for Math)
async function getQueueLength() {
  const result = await db('queue').where({ status: 'waiting' }).count('id as count');
  return parseInt(result[0].count, 10);
}

// 4. Update status (Assign Room)
async function assignRoom(queueId, roomId) {
  return db('queue')
    .where({ id: queueId })
    .update({ status: 'serving', room_id: roomId })
    .returning('*');
}

// 5. Get Dashboard Stats (New Function)
async function getStats() {
  try {
    // 1. Calculate "Start of Today" in JavaScript
    // This creates a timestamp for 00:00:00 today on your local machine
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // 2. Count Total Patients (created AFTER midnight today)
    const totalPatients = await db('queue')
      .where('created_at', '>=', startOfDay) 
      .count('id as count')
      .first();

    // 3. Count Waiting (Status check doesn't need date, usually)
    const waitingCount = await db('queue')
      .where({ status: 'waiting' })
      .count('id as count')
      .first();

    // 4. Calculate Average Wait Time
    // We fetch raw rows to calculate average in JS (safest method)
    const completedToday = await db('queue')
      .where({ status: 'completed' })
      .where('created_at', '>=', startOfDay)
      .select('created_at', 'updated_at');

    // Manually calculate average to avoid SQL compatibility issues
    let avgMinutes = 0;
    if (completedToday.length > 0) {
      const totalMinutes = completedToday.reduce((sum, ticket) => {
        const start = new Date(ticket.created_at);
        const end = new Date(ticket.updated_at);
        const diffMs = end - start; 
        return sum + (diffMs / 1000 / 60); // Convert ms to minutes
      }, 0);
      avgMinutes = Math.round(totalMinutes / completedToday.length);
    }

    return {
      total: totalPatients ? parseInt(totalPatients.count) : 0,
      pending: waitingCount ? parseInt(waitingCount.count) : 0,
      avg_wait: avgMinutes
    };

  } catch (error) {
    console.error("Error getting stats:", error);
    return { total: 0, pending: 0, avg_wait: 0 };
  }
}

module.exports = {
  enqueuePatient,
  getCurrentQueueSnapshot,
  getQueueLength,
  assignRoom,
  getStats
};