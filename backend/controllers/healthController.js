const Alert = require('../models/Alert');
const HealthRecord = require('../models/HealthRecord');
const Patient = require('../models/Patient');
const buildAlertsFromVitals = require('../utils/alertRules');

const addHealthRecord = async (req, res, next) => {
  try {
    const { patientId, heartRate, oxygen, systolicBP, diastolicBP } = req.body;

    if (
      !patientId ||
      heartRate === undefined ||
      oxygen === undefined ||
      systolicBP === undefined ||
      diastolicBP === undefined
    ) {
      return res.status(400).json({
        message: 'Patient ID, heart rate, oxygen, systolic BP, and diastolic BP are required.',
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const healthRecord = await HealthRecord.create({
      patient: patientId,
      heartRate,
      oxygen,
      systolicBP,
      diastolicBP,
      recordedBy: req.user._id,
    });

    const alertPayload = buildAlertsFromVitals({
      patientId,
      healthRecordId: healthRecord._id,
      heartRate,
      oxygen,
      systolicBP,
      diastolicBP,
    });

    const createdAlerts = alertPayload.length > 0 ? await Alert.insertMany(alertPayload) : [];

    return res.status(201).json({
      record: healthRecord,
      alertsGenerated: createdAlerts.length > 0,
      alertsCount: createdAlerts.length,
      alerts: createdAlerts,
    });
  } catch (error) {
    return next(error);
  }
};

const updateHealthRecord = async (req, res, next) => {
  try {
    if (req.user.role !== 'careManager') {
      return res.status(403).json({ message: 'Only care managers can edit health records.' });
    }

    const record = await HealthRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Health record not found.' });
    }

    const { heartRate, oxygen, systolicBP, diastolicBP } = req.body;

    if (heartRate !== undefined) record.heartRate = heartRate;
    if (oxygen !== undefined) record.oxygen = oxygen;
    if (systolicBP !== undefined) record.systolicBP = systolicBP;
    if (diastolicBP !== undefined) record.diastolicBP = diastolicBP;

    const updatedRecord = await record.save();

    await Alert.deleteMany({ healthRecord: updatedRecord._id });

    const alertPayload = buildAlertsFromVitals({
      patientId: updatedRecord.patient,
      healthRecordId: updatedRecord._id,
      heartRate: updatedRecord.heartRate,
      oxygen: updatedRecord.oxygen,
      systolicBP: updatedRecord.systolicBP,
      diastolicBP: updatedRecord.diastolicBP,
    });

    const createdAlerts = alertPayload.length > 0 ? await Alert.insertMany(alertPayload) : [];

    return res.status(200).json({
      record: updatedRecord,
      alertsGenerated: createdAlerts.length > 0,
      alertsCount: createdAlerts.length,
      alerts: createdAlerts,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { addHealthRecord, updateHealthRecord };
