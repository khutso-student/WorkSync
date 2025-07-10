const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  phone: { type: String },
  profilePicture: { type: String }, // store image URL or path
  activityLogs: [
    {
      action: { type: String, enum: ["login", "logout"], required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)
