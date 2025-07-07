const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },     
  position: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true }
}, {
  timestamps: true   
});

module.exports = mongoose.model("Employee", employeeSchema);
