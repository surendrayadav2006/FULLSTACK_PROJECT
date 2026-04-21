const router = require('express').Router();
const { getOpportunities, createOpportunity, saveOpportunity, applyOpportunity } = require('../controllers/opportunityController');
const { protect } = require('../middleware/auth');
const { roleGuard } = require('../middleware/roleGuard');

router.use(protect);
router.get('/', getOpportunities);
router.post('/', roleGuard('alumni', 'admin'), createOpportunity);
router.put('/:id/save', saveOpportunity);
router.put('/:id/apply', applyOpportunity);

module.exports = router;
