import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, UserCheck, Send, Inbox } from 'lucide-react';
import { getMentorshipRequests, updateMentorshipRequest } from '../services/mentorshipService';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function MentorshipPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRequests(); }, [tab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await getMentorshipRequests(tab);
      setRequests(data.requests);
    } catch {} finally { setLoading(false); }
  };

  const handleUpdate = async (id, status) => {
    try {
      await updateMentorshipRequest(id, status);
      toast.success(`Request ${status}!`);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to update request');
    }
  };

  const statusColors = { pending: 'amber', accepted: 'green', rejected: 'red' };
  const tabs = [
    { key: 'all', label: 'All', icon: UserCheck },
    { key: 'received', label: 'Received', icon: Inbox },
    { key: 'sent', label: 'Sent', icon: Send },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Mentorship</h1>
        <p className="text-gray-500 dark:text-dark-400 mt-1">Manage your mentorship connections</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === key ? 'bg-gradient-primary text-white shadow-glow' : 'glass text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700'}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Requests */}
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <UserCheck className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="text-gray-500 text-lg">No mentorship requests</p>
          <p className="text-gray-400 text-sm mt-1">Explore alumni to send your first request!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => {
            const isReceived = req.to?._id === user?.id || req.to?._id === user?._id;
            const otherUser = isReceived ? req.from : req.to;
            return (
              <motion.div key={req._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-5 card-hover">
                <div className="flex items-center gap-4">
                  <Avatar src={otherUser?.avatar} name={otherUser?.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-dark-900 dark:text-white">{otherUser?.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{otherUser?.headline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge color={statusColors[req.status]}>{req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}</Badge>
                      <span className="text-xs text-gray-400">{isReceived ? 'Received' : 'Sent'}</span>
                    </div>
                    {req.message && <p className="text-sm text-gray-500 mt-2 italic">"{req.message}"</p>}
                  </div>
                  {isReceived && req.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" onClick={() => handleUpdate(req._id, 'accepted')} variant="primary">
                        <Check size={16} /> Accept
                      </Button>
                      <Button size="sm" onClick={() => handleUpdate(req._id, 'rejected')} variant="danger">
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
