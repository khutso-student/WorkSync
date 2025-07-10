const express = require('express');
const router = express.Router();
const {
  getDefaultStatuses,
  createDefaultStatus,
  updateDefaultStatus,
  deleteDefaultStatus,
} = require('../../controllers/Settings/defaultStatus.controller');

const { protect, authorize } = require('../../middleware/auth');

// 🛡️ Only admin
router.use(protect, authorize('admin'));

router.get('/', getDefaultStatuses);
router.post('/', createDefaultStatus);
router.put('/:id', updateDefaultStatus);
router.delete('/:id', deleteDefaultStatus);

module.exports = router;
