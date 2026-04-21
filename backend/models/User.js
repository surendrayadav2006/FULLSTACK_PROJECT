const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  industry: { type: String, default: '' },
  course: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  location: { type: String, default: '' },
  company: { type: String, default: '' },
  graduationYear: { type: Number },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' }],
  profileViews: { type: Number, default: 0 },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Profile strength calculation
userSchema.methods.getProfileStrength = function() {
  let strength = 0;
  const fields = ['name', 'email', 'avatar', 'headline', 'bio', 'industry', 'location', 'company'];
  fields.forEach(field => { if (this[field]) strength += 10; });
  if (this.skills && this.skills.length > 0) strength += 10;
  if (this.experience && this.experience > 0) strength += 10;
  return Math.min(strength, 100);
};

// Virtual for profile strength
userSchema.virtual('profileStrength').get(function() {
  return this.getProfileStrength();
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
