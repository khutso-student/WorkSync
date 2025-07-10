const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
    role: { type: String, default: "Employee" },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);