const mongoose = require('mongoose');

const defaultStatusSchema = new mongoose.Schema({
  type: { type: String, enum: ['project', 'task'], required: true },
  status: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DefaultStatus', defaultStatusSchema);
