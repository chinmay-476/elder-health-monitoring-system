const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the patient name.'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Please provide the patient age.'],
      min: 1,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Please provide the patient gender.'],
    },
    emergencyContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    accessCode: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    // This relation helps us show which care manager created the patient.
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.index({ createdAt: -1 });
patientSchema.index({ accessCode: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Patient', patientSchema);
