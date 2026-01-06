const patientModel = require('../models/patientModel');
const queueModel = require('../models/queueModel');
const roomModel = require('../models/roomModel');
const { calculateEta } = require('../utils/etaCalculator');
const { generateQueueNumber } = require('../utils/queueNumber');
const socketService = require('./socketService');

// 1. Broadcast to TV
async function broadcastQueue() {
  const queue = await queueModel.getCurrentQueueSnapshot();
  socketService.emit('queue_update', queue);
  return queue;
}

// 2. Get Data for API (NEW)
async function getCurrentQueue() {
  return queueModel.getCurrentQueueSnapshot();
}

async function getEtaPreview() {
  const queueLength = await queueModel.getQueueLength();
  return {
    queueLength,
    etaMinutes: calculateEta(queueLength)
  };
}

async function getQueueHistory({ limit, page }) {
  // Placeholder: We will build the full history model later
  return { history: [], pagination: { hasMore: false } };
}

// 3. Handle Check-In
async function handleCheckIn({ firstName, lastName, dateOfBirth, phone, symptoms, temp, spo2, hr }) {
  const queueLength = await queueModel.getQueueLength();
  const queueNumber = generateQueueNumber();
  const etaMinutes = calculateEta(queueLength);

  const cleanTemp = temp === '' ? null : temp;
  const cleanSpo2 = spo2 === '' ? null : spo2;
  const cleanHr = hr === '' ? null : hr;

  const patient = await patientModel.createPatient({
    first_name: firstName,
    last_name: lastName,
    date_of_birth: dateOfBirth,
    phone,
    symptoms,
    temp: cleanTemp, 
    spo2: cleanSpo2, 
    hr: cleanHr,
    queue_number: queueNumber,
    eta_minutes: etaMinutes
  });

  await queueModel.enqueuePatient({
    patient_id: patient.id,
    queue_number: queueNumber,
    status: 'waiting'
  });

  await broadcastQueue();
  return { patient, queueNumber, etaMinutes };
}

// 4. Assign Room
async function assignRoomToQueue(queueId, roomId) {
  const queueRecord = await queueModel.assignRoom(queueId, roomId);
  if (queueRecord?.patient_id) {
     await patientModel.updatePatient(queueRecord.patient_id, { room_id: roomId });
  }
  await roomModel.updateRoom(roomId, { is_available: false, current_patient_id: queueRecord?.patient_id });
  await broadcastQueue();
  return queueRecord;
}

module.exports = {
  handleCheckIn,
  assignRoomToQueue,
  broadcastQueue,
  getCurrentQueue,  // Exported
  getEtaPreview,    // Exported
  getQueueHistory   // Exported
};