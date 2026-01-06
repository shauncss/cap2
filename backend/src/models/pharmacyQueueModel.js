const db = require('../db/knex');

async function enqueue(entry) {
  const [record] = await db('queue').insert({ ...entry, status: 'waiting' }).returning('*');
  return record;
}

async function getPharmacyQueue() {
  // For simplicity, we reuse the 'queue' table but filter for pharmacy logic if needed
  // In the real app, this might use a separate table, but let's keep it simple:
  return db('queue')
    .leftJoin('patients', 'queue.patient_id', 'patients.id')
    .where('queue.assigned_room_id', '>', 100) // Assuming pharmacy rooms are ID > 100
    .orWhere('queue.status', 'pharmacy_waiting') 
    .select('*');
}
// Note: This is a simplified placeholder to prevent crashes.
module.exports = { enqueue, getPharmacyQueue };