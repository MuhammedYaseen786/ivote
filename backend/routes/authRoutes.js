const express = require('express');
const router = express.Router();
const { loginVoter, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginVoter);
router.get('/me', protect, getMe);

module.exports = router;
