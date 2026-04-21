import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Edit3, Save, X, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateProfile } from '../services/userService';
import { getMentorshipRequests } from '../services/mentorshipService';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const SKILLS_OPTIONS = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Machine Learning', 'UI/UX', 'Figma',
  'Data Analytics', 'SQL', 'MongoDB', 'AWS', 'Product Management', 'Agile', 'System Design', 'TensorFlow', 'Deep Learning'];

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mentorships, setMentorships] = useState([]);
  const [editForm, setEditForm] = useState({});

  const isOwnProfile = !id || id === currentUser?.id || id === currentUser?._id;

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (isOwnProfile) {
        setProfile(currentUser);
        setEditForm({ ...currentUser });
        const { data } = await getMentorshipRequests('all');
        setMentorships(data.requests.filter(r => r.status === 'accepted'));
      } else {
        const { data } = await getUserById(id);
        setProfile(data.user);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfile({
        name: editForm.name, headline: editForm.headline, bio: editForm.bio,
        skills: editForm.skills, industry: editForm.industry, course: editForm.course, experience: editForm.experience,
        location: editForm.location, company: editForm.company,
      });
      setProfile(data.user);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const toggleSkill = (skill) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills?.includes(skill) ? prev.skills.filter(s => s !== skill) : [...(prev.skills || []), skill],
    }));
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>;
  if (!profile) return <div className="text-center py-16 glass rounded-2xl"><p className="text-gray-500">Profile not found</p></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-primary relative" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 -mt-12">
            <Avatar src={profile.avatar} name={profile.name} size="xl" className="ring-4 ring-white dark:ring-dark-800" />
            <div className="flex-1 pt-2 sm:pt-14">
              <div className="flex items-start justify-between">
                <div>
                  {editing ? (
                    <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mb-2" />
                  ) : (
                    <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">{profile.name}</h1>
                  )}
                  {editing ? (
                    <Input value={editForm.headline || ''} placeholder="Your headline" onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })} />
                  ) : (
                    <p className="text-gray-500 dark:text-dark-400">{profile.headline || 'No headline set'}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    {profile.course && <span className="flex items-center gap-1 font-medium text-primary-500"><GraduationCap size={14} />{profile.course}</span>}
                    {profile.location && <span className="flex items-center gap-1"><MapPin size={14} />{profile.location}</span>}
                    {profile.company && <span className="flex items-center gap-1"><Briefcase size={14} />{profile.company}</span>}
                    {profile.graduationYear && <span className="flex items-center gap-1"><Calendar size={14} />Class of {profile.graduationYear}</span>}
                  </div>
                </div>
                {isOwnProfile && (
                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <Button size="sm" onClick={handleSave} loading={saving}><Save size={16} /> Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditForm({ ...profile }); }}><X size={16} /></Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Edit3 size={16} /> Edit</Button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge color={profile.role === 'alumni' ? 'purple' : profile.role === 'admin' ? 'red' : 'primary'}>
                  {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500">{profile.connections?.length || 0} connections</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-3">About</h2>
            {editing ? (
              <textarea className="input-field min-h-[100px] resize-none" value={editForm.bio || ''}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Tell us about yourself..." />
            ) : (
              <p className="text-gray-600 dark:text-dark-400 leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
            )}
          </Card>

          {/* Skills */}
          <Card>
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-3">Skills</h2>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {SKILLS_OPTIONS.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      editForm.skills?.includes(skill) ? 'bg-gradient-primary text-white' : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-dark-300'}`}>
                    {skill}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length > 0 ? profile.skills.map((s, i) => (
                  <Badge key={s} color={['primary', 'purple', 'pink', 'green', 'amber'][i % 5]}>{s}</Badge>
                )) : <p className="text-gray-500 text-sm">No skills added</p>}
              </div>
            )}
          </Card>

          {/* Experience / Details */}
          {editing && (
            <Card>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-3">Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Company" value={editForm.company || ''} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} />
                <Input label="Location" value={editForm.location || ''} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                <Input label="Industry" value={editForm.industry || ''} onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })} />
                <Input label="Course/Degree" value={editForm.course || ''} onChange={(e) => setEditForm({ ...editForm, course: e.target.value })} placeholder="e.g. B.Tech Computer Science" />
                <Input label="Years of Experience" type="number" value={editForm.experience || 0} onChange={(e) => setEditForm({ ...editForm, experience: parseInt(e.target.value) || 0 })} />
              </div>
            </Card>
          )}

          {/* Mentorship History */}
          {isOwnProfile && mentorships.length > 0 && (
            <Card>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-3">Mentorship Connections</h2>
              <div className="space-y-3">
                {mentorships.map(m => {
                  const other = m.from?._id === (currentUser?.id || currentUser?._id) ? m.to : m.from;
                  return (
                    <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-700/50">
                      <Avatar src={other?.avatar} name={other?.name} size="md" />
                      <div className="flex-1">
                        <p className="font-medium text-dark-900 dark:text-white">{other?.name}</p>
                        <p className="text-xs text-gray-500">{other?.headline}</p>
                      </div>
                      <Badge color="green">Active</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-dark-900 dark:text-white mb-3">Profile Strength</h3>
            <ProgressBar value={profile.profileStrength || 0} />
            <p className="text-xs text-gray-500 mt-2">Complete your profile to increase visibility</p>
          </Card>
          <Card>
            <h3 className="font-bold text-dark-900 dark:text-white mb-3">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Connections</span>
                <span className="font-semibold text-dark-900 dark:text-white">{profile.connections?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Profile Views</span>
                <span className="font-semibold text-dark-900 dark:text-white">{profile.profileViews || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Experience</span>
                <span className="font-semibold text-dark-900 dark:text-white">{profile.experience || 0} years</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
