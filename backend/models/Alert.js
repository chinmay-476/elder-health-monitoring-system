const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    healthRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthRecord',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Heart Rate', 'Oxygen', 'Blood Pressure'],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ['alert', 'warning', 'critical'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
