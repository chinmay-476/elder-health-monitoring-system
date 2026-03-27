const Alert = require('../models/Alert');
const HealthRecord = require('../models/HealthRecord');
const Patient = require('../models/Patient');
const generatePatientAccessCode = require('../utils/generatePatientAccessCode');

const getPatients = async (req, res, next) => {
  try {
    if (req.user.role !== 'careManager' && !req.user.linkedPatient) {
      return res.status(200).json([]);
    }

    const filter =
      req.user.role === 'careManager' ? {} : { _id: req.user.linkedPatient };

    const patients = await Patient.find(filter)
      .populate('managedBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json(patients);
  } catch (error) {
    return next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    if (
      req.user.role !== 'careManager' &&
      (!req.user.linkedPatient || req.user.linkedPatient.toString() !== req.params.id)
    ) {
      return res.status(403).json({
        message: 'You can only access the patient linked to your account.',
      });
    }

    const patient = await Patient.findById(req.params.id).populate('managedBy', 'name email role');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const [healthHistory, alerts] = await Promise.all([
      HealthRecord.find({ patient: patient._id })
        .populate('recordedBy', 'name role')
        .sort({ createdAt: -1 }),
      Alert.find({ patient: patient._id }).sort({ createdAt: -1 }),
    ]);

    return res.status(200).json({
      patient,
      healthHistory,
      alerts,
    });
  } catch (error) {
    return next(error);
  }
};

const addPatient = async (req, res, next) => {
  try {
    const { name, age, gender, emergencyContact } = req.body;

    if (!name || !age || !gender || !emergencyContact?.name || !emergencyContact?.phone) {
      return res.status(400).json({
        message: 'Name, age, gender, and emergency contact are required.',
      });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      emergencyContact,
      accessCode: await generatePatientAccessCode(),
      managedBy: req.user._id,
    });

    return res.status(201).json(patient);
  } catch (error) {
    return next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    if (req.user.role !== 'careManager') {
      return res.status(403).json({ message: 'Only care managers can edit patients.' });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const { name, age, gender, emergencyContact } = req.body;

    if (name !== undefined) patient.name = name;
    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (emergencyContact?.name !== undefined) patient.emergencyContact.name = emergencyContact.name;
    if (emergencyContact?.phone !== undefined) patient.emergencyContact.phone = emergencyContact.phone;

    const updatedPatient = await patient.save();
    return res.status(200).json(updatedPatient);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getPatients, getPatientById, addPatient, updatePatient };
