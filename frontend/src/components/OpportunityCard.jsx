import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bookmark, BookmarkCheck, ExternalLink, Clock } from 'lucide-react';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { saveOpportunity, applyOpportunity } from '../services/opportunityService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const typeColors = { job: 'primary', internship: 'purple', freelance: 'green', volunteer: 'amber' };

export default function OpportunityCard({ opportunity, onUpdate }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(opportunity.savedBy?.includes(user?.id || user?._id));
  const [applied, setApplied] = useState(opportunity.applicants?.includes(user?.id || user?._id));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      const { data } = await saveOpportunity(opportunity._id);
      setSaved(data.saved);
      toast.success(data.saved ? 'Saved!' : 'Removed from saved');
    } catch { toast.error('Failed to save'); }
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      await applyOpportunity(opportunity._id);
      setApplied(true);
      toast.success('Application submitted!');
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally { setLoading(false); }
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-5 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge color={typeColors[opportunity.type]} size="sm">
              {opportunity.type?.charAt(0).toUpperCase() + opportunity.type?.slice(1)}
            </Badge>
          </div>
          <h3 className="font-bold text-dark-900 dark:text-white text-lg">{opportunity.title}</h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{opportunity.company}</p>
        </div>
        <button onClick={handleSave} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
          {saved ? <BookmarkCheck size={20} className="text-primary-500" /> : <Bookmark size={20} className="text-gray-400" />}
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-dark-400 line-clamp-2">{opportunity.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        {opportunity.location && <span className="flex items-center gap-1"><MapPin size={12} />{opportunity.location}</span>}
        {opportunity.salary && <span className="font-medium text-emerald-600">💰 {opportunity.salary}</span>}
      </div>

      {opportunity.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {opportunity.skills.slice(0, 3).map(s => <Badge key={s} color="gray" size="sm">{s}</Badge>)}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button onClick={handleApply} loading={loading} disabled={applied} size="sm" className="flex-1"
          variant={applied ? 'secondary' : 'primary'}>
          {applied ? '✓ Applied' : 'Apply Now'}
        </Button>
      </div>
    </motion.div>
  );
}
