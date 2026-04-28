const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

// @route POST /api/vote
// @desc  Cast a vote
const castVote = async (req, res) => {
  const { candidateId } = req.body;
  const voterId = req.voter._id;

  if (!candidateId) {
    return res.status(400).json({ message: 'Please select a candidate' });
  }

  try {
    // Check election is open
    const election = await Election.findOne();
    if (election && !election.isOpen) {
      return res.status(403).json({ message: 'Voting is currently closed.' });
    }

    // Check if already voted
    const voter = await Voter.findById(voterId);
    if (voter.hasVoted) {
      return res.status(400).json({ message: 'You have already cast your vote.' });
    }

    // Check candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Cast the vote (atomic)
    candidate.votes += 1;
    await candidate.save();

    voter.hasVoted = true;
    voter.votedFor = candidateId;
    voter.votedAt = new Date();
    await voter.save();

    res.json({
      message: `✅ Your vote for ${candidate.name} has been recorded!`,
      candidate: { name: candidate.name, party: candidate.party }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { castVote };
