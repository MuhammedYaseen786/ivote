const jwt = require('jsonwebtoken');
const Voter = require('../models/Voter');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

// @route POST /api/auth/login
// @desc  Voter logs in with Name + Voter ID
const loginVoter = async (req, res) => {
  const { name, voterId } = req.body;

  if (!name || !voterId) {
    return res.status(400).json({ message: 'Please provide your name and voter ID' });
  }

  try {
    // Find voter by ID (case-insensitive)
    let voter = await Voter.findOne({ voterId: voterId.toUpperCase() });

    if (!voter) {
      return res.status(404).json({ message: 'Voter ID not found. Please contact the administrator.' });
    }

    // Check name matches (case-insensitive)
    if (voter.name.toLowerCase() !== name.toLowerCase().trim()) {
      return res.status(401).json({ message: 'Name does not match our records.' });
    }

    const token = generateToken(voter._id);

    res.json({
      token,
      voter: {
        id: voter._id,
        name: voter.name,
        voterId: voter.voterId,
        hasVoted: voter.hasVoted
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/auth/me
// @desc  Get current voter info
const getMe = async (req, res) => {
  res.json({
    id: req.voter._id,
    name: req.voter.name,
    voterId: req.voter.voterId,
    hasVoted: req.voter.hasVoted
  });
};

module.exports = { loginVoter, getMe };
