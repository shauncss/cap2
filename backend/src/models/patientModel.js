const db = require('../db/knex');

async function createPatient(patient) {
  const [record] = await db('patients').insert(patient).returning('*');
  return record;
}

async function updatePatient(id, updates) {
  const [record] = await db('patients').where({ id }).update(updates).returning('*');
  return record;
}

module.exports = { createPatient, updatePatient };