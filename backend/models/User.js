const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a user name.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['careManager', 'parent', 'child'],
      default: 'parent',
    },
    linkedPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// This unique partial index enforces only one parent account per patient.
userSchema.index(
  { linkedPatient: 1, role: 1 },
  {
    unique: true,
    partialFilterExpression: {
      role: 'parent',
      linkedPatient: { $exists: true, $ne: null },
    },
  }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  // Password hashing protects the real password even if the database is exposed.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
