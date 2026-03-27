const crypto = require('crypto');
const Patient = require('../models/Patient');

const generateCandidateCode = () =>
  `EHM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

const generatePatientAccessCode = async () => {
  // Retry a few times to avoid a rare duplicate code collision.
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidateCode = generateCandidateCode();
    const existingPatient = await Patient.findOne({ accessCode: candidateCode });

    if (!existingPatient) {
      return candidateCode;
    }
  }

  throw new Error('Unable to generate a unique patient access code.');
};

module.exports = generatePatientAccessCode;
