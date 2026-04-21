import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Percent, GraduationCap, UserPlus, Check } from 'lucide-react';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { sendMentorshipRequest } from '../services/mentorshipService';
import toast from 'react-hot-toast';

const getDomainTheme = (course = '') => {
  const c = course.toLowerCase();
  if (c.includes('cse') || c.includes('computer') || c.includes('information technology') || c.includes('data science'))
    return { gradient: 'from-blue-500 to-cyan-400', bg: 'bg-blue-500/8 dark:bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-600 dark:text-blue-400', icon: '💻' };
  if (c.includes('mechanical') || c.includes('automobile') || c.includes('manufacturing'))
    return { gradient: 'from-orange-500 to-amber-400', bg: 'bg-orange-500/8 dark:bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-600 dark:text-orange-400', icon: '⚙️' };
  if (c.includes('ece') || c.includes('electronics') || c.includes('electrical'))
    return { gradient: 'from-purple-500 to-violet-400', bg: 'bg-purple-500/8 dark:bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-600 dark:text-purple-400', icon: '🔌' };
  if (c.includes('civil') || c.includes('structural') || c.includes('construction'))
    return { gradient: 'from-emerald-500 to-green-400', bg: 'bg-emerald-500/8 dark:bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', icon: '🏗️' };
  if (c.includes('design') || c.includes('ux') || c.includes('des'))
    return { gradient: 'from-pink-500 to-rose-400', bg: 'bg-pink-500/8 dark:bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-600 dark:text-pink-400', icon: '🎨' };
  if (c.includes('mba') || c.includes('business') || c.includes('finance') || c.includes('marketing') || c.includes('hr'))
    return { gradient: 'from-indigo-500 to-blue-400', bg: 'bg-indigo-500/8 dark:bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', icon: '📊' };
  return { gradient: 'from-gray-500 to-slate-400', bg: 'bg-gray-500/8 dark:bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-600 dark:text-gray-400', icon: '🎓' };
};

export default function AlumniCard({ user, onConnect }) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const colors = ['primary', 'purple', 'pink', 'green', 'amber'];
  const theme = getDomainTheme(user.course);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await sendMentorshipRequest({ to: user._id, message: 'I would love to connect and learn from you!' });
      setConnected(true);
      toast.success('Mentorship request sent!');
      onConnect?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
      className={`relative rounded-2xl overflow-hidden border ${theme.border} ${theme.bg} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}>
      
      {/* Top gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />
      
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar src={user.avatar} name={user.name} size="lg" />
            <span className="absolute -bottom-1 -right-1 text-sm">{theme.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-dark-900 dark:text-white truncate">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-dark-400 truncate">{user.headline}</p>
            {user.course && (
              <p className={`text-xs font-semibold flex items-center gap-1 mt-1 ${theme.text}`}>
                <GraduationCap size={12} /> {user.course}
              </p>
            )}
            {user.location && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <MapPin size={12} /> {user.location}
              </p>
            )}
          </div>
          {user.matchPercentage > 0 && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${theme.gradient} text-white shadow-sm`}>
              {user.matchPercentage}%
            </div>
          )}
        </div>

        {user.skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {user.skills.slice(0, 4).map((skill, i) => (
              <span key={skill} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/60 dark:bg-white/10 text-dark-700 dark:text-dark-200 border border-white/40 dark:border-white/5">
                {skill}
              </span>
            ))}
            {user.skills.length > 4 && <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/40 dark:bg-white/5 text-gray-500">+{user.skills.length - 4}</span>}
          </div>
        )}

        <div className="mt-4">
          <button onClick={handleConnect} disabled={loading || connected}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              connected
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 cursor-default'
                : `bg-gradient-to-r ${theme.gradient} text-white hover:shadow-lg hover:shadow-${theme.gradient.split('-')[1]}/25 active:scale-95`
            } disabled:opacity-60`}>
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : connected ? (
              <><Check size={16} /> Request Sent</>
            ) : (
              <><UserPlus size={16} /> Connect & Mentor</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
