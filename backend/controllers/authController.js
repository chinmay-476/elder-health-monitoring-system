const Patient = require('../models/Patient');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  linkedPatient: user.linkedPatient || null,
  token: generateToken(user._id),
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, patientAccessCode } = req.body;
    const normalizedRole = role || 'parent';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    let linkedPatient = null;

    if (normalizedRole === 'parent' || normalizedRole === 'child') {
      if (!patientAccessCode) {
        return res.status(400).json({
          message: 'Parent and child accounts must enter a valid patient access code.',
        });
      }

      linkedPatient = await Patient.findOne({ accessCode: patientAccessCode.trim().toUpperCase() });

      if (!linkedPatient) {
        return res.status(404).json({ message: 'Patient access code is invalid.' });
      }

      if (normalizedRole === 'parent') {
        const existingParent = await User.findOne({
          role: 'parent',
          linkedPatient: linkedPatient._id,
        });

        if (existingParent) {
          return res.status(400).json({
            message: 'A parent account already exists for this patient. Only one parent is allowed.',
          });
        }
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole,
      linkedPatient: linkedPatient?._id || null,
    });

    const createdUser = await User.findById(user._id).populate(
      'linkedPatient',
      'name accessCode age gender emergencyContact'
    );

    return res.status(201).json(buildAuthResponse(createdUser));
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('linkedPatient', 'name accessCode age gender emergencyContact');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'linkedPatient',
      'name accessCode age gender emergencyContact'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
