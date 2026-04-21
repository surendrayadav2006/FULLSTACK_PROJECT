const MentorshipRequest = require('../models/MentorshipRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Send mentorship request
// @route   POST /api/mentorship
exports.sendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (to === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const targetUser = await User.findById(to);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existing = await MentorshipRequest.findOne({
      $or: [
        { from: req.user._id, to },
        { from: to, to: req.user._id },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: 'Mentorship request already exists' });
    }

    const request = await MentorshipRequest.create({
      from: req.user._id,
      to,
      message: message || '',
    });

    // Create notification
    await Notification.create({
      user: to,
      type: 'mentorship',
      title: 'New Mentorship Request',
      message: `${req.user.name} sent you a mentorship request`,
      fromUser: req.user._id,
      link: '/mentorship',
    });

    const populated = await request.populate([
      { path: 'from', select: 'name avatar headline role' },
      { path: 'to', select: 'name avatar headline role' },
    ]);

    res.status(201).json({ request: populated });
  } catch (error) {
    console.error('Send mentorship error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mentorship request already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get mentorship requests
// @route   GET /api/mentorship
exports.getRequests = async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    let query = {};

    if (type === 'sent') {
      query = { from: req.user._id };
    } else if (type === 'received') {
      query = { to: req.user._id };
    } else {
      query = { $or: [{ from: req.user._id }, { to: req.user._id }] };
    }

    const requests = await MentorshipRequest.find(query)
      .populate('from', 'name avatar headline role skills')
      .populate('to', 'name avatar headline role skills')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update mentorship request
// @route   PUT /api/mentorship/:id
exports.updateRequest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    await request.save();

    // If accepted, add each other as connections
    if (status === 'accepted') {
      await User.findByIdAndUpdate(request.from, { $addToSet: { connections: request.to } });
      await User.findByIdAndUpdate(request.to, { $addToSet: { connections: request.from } });
    }

    // Notify sender
    await Notification.create({
      user: request.from,
      type: 'mentorship',
      title: `Mentorship Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `${req.user.name} has ${status} your mentorship request`,
      fromUser: req.user._id,
      link: '/mentorship',
    });

    const populated = await request.populate([
      { path: 'from', select: 'name avatar headline role' },
      { path: 'to', select: 'name avatar headline role' },
    ]);

    res.json({ request: populated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
