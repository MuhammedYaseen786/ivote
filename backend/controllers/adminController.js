const Candidate = require('../models/Candidate');
const Voter = require('../models/Voter');
const Election = require('../models/Election');
const nodemailer = require('nodemailer');

// Add candidate
const addCandidate = async (req, res) => {
  try {
    const { name, position, party, bio, color } = req.body;
    const candidate = await Candidate.create({ name, position, party, bio, color });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate removed' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a voter
const deleteVoter = async (req, res) => {
  try {
    await Voter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Voter removed' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Register a voter
const registerVoter = async (req, res) => {
  try {
    const { name, voterId, email } = req.body;
    const voter = await Voter.create({ name, voterId, email });

    let emailSent = false;
    // Send email if provided
    if (email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // You can change this to any service you prefer
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: `"iVOTE Election Commission" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Official: Your iVOTE Registration Credentials',
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <div style="background-color: #1e3a8a; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 600;">iVOTE</h1>
                <p style="color: #93c5fd; margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Official Election Commission</p>
              </div>
              
              <!-- Body -->
              <div style="padding: 32px 24px;">
                <p style="color: #374151; font-size: 16px; margin-top: 0;">Dear <strong>${name}</strong>,</p>
                <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
                  You have been officially registered to participate in the upcoming election. Please find your secure voting credentials enclosed below.
                </p>
                
                <!-- Credential Box -->
                <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Your Official Voter ID</p>
                  <p style="margin: 8px 0 0; font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: 3px; font-family: monospace;">${voterId}</p>
                </div>
                
                <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                  Your vote is strictly confidential. You will need this Voter ID to access the secure voting portal and cast your ballot.
                </p>
                
                <!-- CTA -->
                <div style="text-align: center; margin: 32px 0;">
                  <a href="http://localhost:3000" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">Access Voting Portal</a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 12px; margin: 0 0 8px; line-height: 1.5;">
                  <strong>CONFIDENTIALITY NOTICE:</strong> This email contains secure credentials. Do not forward this email or share your Voter ID with anyone.
                </p>
                <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                  &copy; ${new Date().getFullYear()} iVOTE System. All rights reserved.
                </p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr);
      }
    }

    res.status(201).json({ 
      message: emailSent ? 'Voter registered and email sent!' : 'Voter registered', 
      voter,
      emailSent
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Bulk register voters
const bulkRegisterVoters = async (req, res) => {
  try {
    const { voters } = req.body; // Array of { name, voterId }
    const created = await Voter.insertMany(voters, { ordered: false });
    res.status(201).json({ message: `${created.length} voters registered` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all voters
const getVoters = async (req, res) => {
  try {
    const voters = await Voter.find().select('-__v').sort({ createdAt: -1 });
    res.json(voters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle election open/close
const toggleElection = async (req, res) => {
  try {
    let election = await Election.findOne();
    if (!election) {
      election = await Election.create({ title: 'General Election', isOpen: true });
    } else {
      election.isOpen = !election.isOpen;
      await election.save();
    }
    res.json({ isOpen: election.isOpen, message: `Election is now ${election.isOpen ? 'OPEN' : 'CLOSED'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get election status
const getElectionStatus = async (req, res) => {
  try {
    let election = await Election.findOne();
    if (!election) election = { title: 'General Election', isOpen: true };
    res.json(election);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset all votes (for testing)
const resetVotes = async (req, res) => {
  try {
    await Candidate.updateMany({}, { votes: 0 });
    await Voter.updateMany({}, { hasVoted: false, votedFor: null, votedAt: null });
    res.json({ message: 'All votes reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addCandidate, deleteCandidate, registerVoter, deleteVoter, bulkRegisterVoters, getVoters, toggleElection, getElectionStatus, resetVotes };
