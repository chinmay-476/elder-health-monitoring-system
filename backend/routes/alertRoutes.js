const express = require('express');
const { getAlerts, markAlertRead } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getAlerts);
router.route('/:id/read').put(protect, markAlertRead);

module.exports = router;
