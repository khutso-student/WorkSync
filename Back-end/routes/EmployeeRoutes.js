const express = require('express');
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/EmployeeControllers');

const { protect, authorize } = require('../middleware/auth');

// ✅ Allow both admin and employee to view
router.get('/', protect, authorize('admin', 'employee'), getEmployees);

// ✅ Only admin can create/update/delete
router.post('/', protect, authorize('admin'), createEmployee);
router.put('/:id', protect, authorize('admin'), updateEmployee);
router.delete('/:id', protect, authorize('admin'), deleteEmployee);

module.exports = router;
