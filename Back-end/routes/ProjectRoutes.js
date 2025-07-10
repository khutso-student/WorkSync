const express = require('express');
const router = express.Router();

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getCompletedProjects
} = require('../controllers/ProjectControllers');

const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getProjects);
router.get('/completed', protect, getCompletedProjects);
router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
