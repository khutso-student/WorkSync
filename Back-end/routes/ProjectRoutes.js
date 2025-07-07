const express = require('express');
const router = express.Router();

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/ProjectControllers');

const { protect, authorize } = require('../middleware/Auth');

router.get('/', protect, getProjects);
router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
