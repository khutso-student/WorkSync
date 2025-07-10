const express = require('express');
const router = express.Router();
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../../controllers/Settings/adminSettings.controller')

const { protect, authorize } = require('../../middleware/auth');

// 🛡️ Only admin
router.use(protect, authorize('admin'));

router.get('/', getRoles);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
