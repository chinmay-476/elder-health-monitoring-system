const express = require('express');
const { addPatient, getPatientById, getPatients, updatePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/').get(protect, getPatients).post(protect, authorize('careManager'), addPatient);
router
  .route('/:id')
  .get(protect, getPatientById)
  .put(protect, authorize('careManager'), updatePatient);

module.exports = router;
