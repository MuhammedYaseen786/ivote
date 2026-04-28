const Candidate = require('../models/Candidate');

// @route GET /api/candidates
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().select('-__v');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCandidates };
