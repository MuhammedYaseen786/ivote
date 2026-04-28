const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  party: {
    type: String,
    required: [true, 'Party is required'],
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#6366f1'   // accent color per candidate
  },
  votes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
