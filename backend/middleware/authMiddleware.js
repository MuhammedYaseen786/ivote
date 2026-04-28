const jwt = require('jsonwebtoken');
const Voter = require('../models/Voter');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.voter = await Voter.findById(decoded.id).select('-__v');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};

const adminProtect = (req, res, next) => {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ message: 'Admin access denied' });
  }
  next();
};

module.exports = { protect, adminProtect };
