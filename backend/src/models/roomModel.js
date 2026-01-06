const db = require('../db/knex');

async function getRooms() {
  return db('rooms').orderBy('id');
}

async function getFirstAvailableRoom() {
  return db('rooms')
    .where({ is_available: true })
    .orderBy([
      { column: 'updated_at', order: 'asc' },
      { column: 'id', order: 'asc' }
    ])
    .first();
}

async function updateRoom(id, updates) {
  const [record] = await db('rooms').where({ id }).update({ ...updates, updated_at: db.fn.now() }).returning('*');
  return record;
}

module.exports = { getRooms, getFirstAvailableRoom, updateRoom };