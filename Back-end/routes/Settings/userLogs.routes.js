const express = require('express');
const router = express.Router();
const {
  getUserActivityLogs,
} = require('../../controllers/Settings/userActivityLog.controller');

const { protect, authorize } = require('../../middleware/auth');

// 🛡️ Only admin
router.use(protect, authorize('admin'));

router.get('/', getUserActivityLogs);

module.exports = router;
