// routes/settings/userSettings.routes.js
const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  uploadProfilePicture
} = require('../../controllers/Settings/userSettings.controller');
const { protect } = require('../../middleware/auth');

// optional: if you're handling image upload
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // configure path or storage engine as needed

// 🛡️ Protected routes
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
