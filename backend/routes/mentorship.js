const router = require('express').Router();
const { sendRequest, getRequests, updateRequest } = require('../controllers/mentorshipController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', sendRequest);
router.get('/', getRequests);
router.put('/:id', updateRequest);

module.exports = router;
