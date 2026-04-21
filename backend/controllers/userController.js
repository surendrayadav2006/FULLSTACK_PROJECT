const User = require('../models/User');
const MentorshipRequest = require('../models/MentorshipRequest');

// @desc    Get all users with search/filters
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const { search, skills, industry, role, page = 1, limit = 12 } = req.query;
    const query = { _id: { $ne: req.user._id } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { headline: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    if (skills) {
      const skillsArr = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArr };
    }
    if (industry) query.industry = { $regex: industry, $options: 'i' };
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Calculate match percentage based on shared skills
    const currentUser = req.user;
    const usersWithMatch = users.map(user => {
      const userObj = user.toJSON();
      if (currentUser.skills.length > 0 && user.skills.length > 0) {
        const sharedSkills = currentUser.skills.filter(s => user.skills.includes(s));
        userObj.matchPercentage = Math.round((sharedSkills.length / Math.max(currentUser.skills.length, user.skills.length)) * 100);
      } else {
        userObj.matchPercentage = 0;
      }
      return userObj;
    });

    res.json({
      users: usersWithMatch,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'name avatar headline role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment profile views
    if (req.user._id.toString() !== req.params.id) {
      await User.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });
    }

    // Check mentorship status
    const mentorshipSent = await MentorshipRequest.findOne({ from: req.user._id, to: req.params.id });
    const mentorshipReceived = await MentorshipRequest.findOne({ from: req.params.id, to: req.user._id });

    const userObj = user.toJSON();
    userObj.mentorshipStatus = mentorshipSent ? mentorshipSent.status : mentorshipReceived ? `received_${mentorshipReceived.status}` : null;
    userObj.isConnected = req.user.connections.includes(user._id);

    res.json({ user: userObj });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'headline', 'bio', 'skills', 'industry', 'course', 'experience', 'location', 'company', 'avatar', 'graduationYear'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get mentor recommendations (skill-based matching)
// @route   GET /api/users/recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser.skills || currentUser.skills.length === 0) {
      const alumni = await User.find({ role: 'alumni', _id: { $ne: currentUser._id } })
        .select('-password').limit(6);
      return res.json({ recommendations: alumni });
    }

    const alumni = await User.find({
      role: 'alumni',
      _id: { $ne: currentUser._id },
      skills: { $in: currentUser.skills },
    }).select('-password').limit(20);

    const ranked = alumni.map(user => {
      const shared = currentUser.skills.filter(s => user.skills.includes(s));
      return { ...user.toJSON(), matchPercentage: Math.round((shared.length / Math.max(currentUser.skills.length, user.skills.length)) * 100) };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 6);

    res.json({ recommendations: ranked });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.aggregate([
      { $match: { role: 'alumni' } },
      { $addFields: { score: { $add: [{ $size: '$connections' }, { $multiply: ['$profileViews', 0.1] }] } } },
      { $sort: { score: -1 } },
      { $limit: 10 },
      { $project: { password: 0 } },
    ]);
    res.json({ leaderboard: topUsers });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalConnections = req.user.connections.length;
    const mentorshipsActive = await MentorshipRequest.countDocuments({
      $or: [{ from: userId }, { to: userId }],
      status: 'accepted',
    });
    const mentorshipsPending = await MentorshipRequest.countDocuments({
      $or: [{ from: userId }, { to: userId }],
      status: 'pending',
    });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalStudents = await User.countDocuments({ role: 'student' });

    res.json({
      stats: {
        connections: totalConnections,
        activeMentorships: mentorshipsActive,
        pendingRequests: mentorshipsPending,
        profileViews: req.user.profileViews,
        totalAlumni,
        totalStudents,
        profileStrength: req.user.profileStrength,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trending skills
// @route   GET /api/users/trending-skills
exports.getTrendingSkills = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);
    res.json({ skills: result.map(r => ({ name: r._id, count: r.count })) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
