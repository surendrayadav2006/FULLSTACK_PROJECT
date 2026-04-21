const router = require('express').Router();
const { getUsers, getUserById, updateProfile, getRecommendations, getLeaderboard, getStats, getTrendingSkills } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/recommendations', getRecommendations);
router.get('/leaderboard', getLeaderboard);
router.get('/stats', getStats);
router.get('/trending-skills', getTrendingSkills);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);

module.exports = router;
