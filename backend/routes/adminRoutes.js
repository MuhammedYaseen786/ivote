const express = require('express');
const router = express.Router();
const {
  addCandidate, deleteCandidate,
  registerVoter, deleteVoter, bulkRegisterVoters, getVoters,
  toggleElection, getElectionStatus, resetVotes
} = require('../controllers/adminController');
const { adminProtect } = require('../middleware/authMiddleware');

router.use(adminProtect); // All admin routes require admin token

router.post('/candidates', addCandidate);
router.delete('/candidates/:id', deleteCandidate);

router.post('/voters', registerVoter);
router.delete('/voters/:id', deleteVoter);
router.post('/voters/bulk', bulkRegisterVoters);
router.get('/voters', getVoters);

router.post('/election/toggle', toggleElection);
router.get('/election/status', getElectionStatus);
router.post('/reset', resetVotes);

module.exports = router;
