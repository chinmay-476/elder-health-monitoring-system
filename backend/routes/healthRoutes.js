const express = require('express');
const { addHealthRecord, updateHealthRecord } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/').post(protect, authorize('careManager'), addHealthRecord);
router.route('/:id').put(protect, authorize('careManager'), updateHealthRecord);

module.exports = router;
