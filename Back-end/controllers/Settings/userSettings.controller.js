const User = require('../../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator'); // for email validation and more
const fs = require('fs');
const path = require('path');

// Helper: Validate password strength (at least 8 chars, with numbers and letters)
const isStrongPassword = (password) => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Optional phone validation (if you want)
    if (phone && !validator.isMobilePhone(phone, 'any')) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Check if email is taken by someone else
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use by another user" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone },
      { new: true }
    ).select('-password');

    return res.json({ message: "Profile updated successfully", user: updated });
  } catch (err) {
    console.error('Error updating profile:', err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Failed to update profile" });
    }
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log('🔍 req.user:', req.user);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ 
        message: "New password must be at least 8 characters long and include numbers and letters" 
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error('Error changing password:', err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Failed to change password" });
    }
  }
};

exports.uploadProfilePicture = async (req, res) => {
  console.log('📦 Uploaded file:', req.file);
  console.log('🧍‍♂️ Authenticated user:', req.user);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    // ✅ Save relative path to DB (so the frontend can load it)
    const imageUrl = `uploads/${req.file.filename}`;


    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');

    res.json({ message: "Profile picture updated successfully", user: updated });
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
};

