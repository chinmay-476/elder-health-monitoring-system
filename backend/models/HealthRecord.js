const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    heartRate: {
      type: Number,
      required: [true, 'Please provide the heart rate.'],
      min: 1,
    },
    oxygen: {
      type: Number,
      required: [true, 'Please provide the oxygen level.'],
      min: 1,
      max: 100,
    },
    systolicBP: {
      type: Number,
      required: [true, 'Please provide the systolic blood pressure.'],
      min: 1,
    },
    diastolicBP: {
      type: Number,
      required: [true, 'Please provide the diastolic blood pressure.'],
      min: 1,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

healthRecordSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
