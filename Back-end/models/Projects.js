const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, },
  description: { type: String, required: true, },
  status: { type: String, enum: ['Not complete', 'In progress', 'Complete'], default: 'Not complete', required: true, },
 createdAt: { type: Date, default: Date.now, },
});

module.exports = mongoose.model('Projects', projectSchema);
