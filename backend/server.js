const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'https://ivote-system.onrender.com/'], credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/vote', require('./routes/voteRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'iVOTE API running ✅' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Your IP address is likely blocked by MongoDB Atlas. Please whitelist it.');
  });

// Always start the server so the frontend doesn't break
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
