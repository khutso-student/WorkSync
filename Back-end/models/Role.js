const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'admin', 'employee', 'manager'
  permissions: [{ type: String }] // Optional: list of permissions if you want to expand later
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
