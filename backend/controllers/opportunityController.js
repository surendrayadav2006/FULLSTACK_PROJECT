const Opportunity = require('../models/Opportunity');
const Notification = require('../models/Notification');

exports.getOpportunities = async (req, res) => {
  try {
    const { type, skills, search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    if (skills) query.skills = { $in: skills.split(',').map(s => s.trim()) };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await Opportunity.countDocuments(query);
    const opportunities = await Opportunity.find(query)
      .populate('postedBy', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ opportunities, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createOpportunity = async (req, res) => {
  try {
    const { title, company, description, type, skills, location, salary, deadline } = req.body;
    const opportunity = await Opportunity.create({
      title, company, description, type: type || 'job',
      skills: skills || [], location: location || 'Remote',
      salary: salary || '', deadline: deadline || null, postedBy: req.user._id,
    });
    const populated = await opportunity.populate('postedBy', 'name avatar role');
    res.status(201).json({ opportunity: populated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveOpportunity = async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Not found' });
    const isSaved = opp.savedBy.includes(req.user._id);
    if (isSaved) opp.savedBy = opp.savedBy.filter(id => id.toString() !== req.user._id.toString());
    else opp.savedBy.push(req.user._id);
    await opp.save();
    res.json({ saved: !isSaved, opportunity: opp });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.applyOpportunity = async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Not found' });
    if (opp.applicants.includes(req.user._id)) return res.status(400).json({ message: 'Already applied' });
    opp.applicants.push(req.user._id);
    await opp.save();
    await Notification.create({
      user: opp.postedBy, type: 'opportunity', title: 'New Application',
      message: `${req.user.name} applied to "${opp.title}"`, fromUser: req.user._id, link: '/opportunities',
    });
    res.json({ applied: true, opportunity: opp });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
