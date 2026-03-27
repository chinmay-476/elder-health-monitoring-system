const Alert = require('../models/Alert');

const getAlerts = async (req, res, next) => {
  try {
    if (req.user.role !== 'careManager' && !req.user.linkedPatient) {
      return res.status(200).json([]);
    }

    const filter =
      req.user.role === 'careManager' ? {} : { patient: req.user.linkedPatient };

    const alerts = await Alert.find(filter)
      .populate('patient', 'name age gender emergencyContact')
      .populate('healthRecord', 'heartRate oxygen systolicBP diastolicBP createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json(alerts);
  } catch (error) {
    return next(error);
  }
};

const markAlertRead = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found.' });
    }

    if (req.user.role !== 'careManager' && !req.user.linkedPatient) {
      return res.status(403).json({ message: 'Not authorized to update this alert.' });
    }

    if (req.user.role !== 'careManager') {
      if (!req.user.linkedPatient || alert.patient.toString() !== req.user.linkedPatient.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this alert.' });
      }
    }

    alert.isRead = true;
    await alert.save();

    return res.status(200).json(alert);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAlerts, markAlertRead };
