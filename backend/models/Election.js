const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'General Election 2024' },
  isOpen: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Election', electionSchema);
