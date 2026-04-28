const Candidate = require('../models/Candidate');
const Voter = require('../models/Voter');

// @route GET /api/results
const getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find().select('name party color votes position').sort({ votes: -1 });
    const totalVoters = await Voter.countDocuments();
    const totalVoted = await Voter.countDocuments({ hasVoted: true });
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

    const results = candidates.map(c => ({
      id: c._id,
      name: c.name,
      party: c.party,
      position: c.position,
      color: c.color,
      votes: c.votes,
      percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : '0.0'
    }));

    res.json({
      results,
      stats: {
        totalVoters,
        totalVoted,
        totalVotes,
        turnout: totalVoters > 0 ? ((totalVoted / totalVoters) * 100).toFixed(1) : '0.0'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getResults };
