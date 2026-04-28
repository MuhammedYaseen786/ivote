const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  voterId: {
    type: String,
    required: [true, 'Voter ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    default: null
  },
  votedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Voter', voterSchema);
