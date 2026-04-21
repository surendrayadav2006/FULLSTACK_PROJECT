import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Briefcase } from 'lucide-react';
import { getOpportunities, createOpportunity } from '../services/opportunityService';
import { useAuth } from '../context/AuthContext';
import OpportunityCard from '../components/OpportunityCard';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', description: '', type: 'job', skills: '', location: '', salary: '' });

  useEffect(() => {
    const timer = setTimeout(fetchOpportunities, 300);
    return () => clearTimeout(timer);
  }, [search, typeFilter]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      const { data } = await getOpportunities(params);
      setOpportunities(data.opportunities);
    } catch {} finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) { toast.error('Fill required fields'); return; }
    setCreating(true);
    try {
      await createOpportunity({ ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      toast.success('Opportunity posted!');
      setShowCreate(false);
      setForm({ title: '', company: '', description: '', type: 'job', skills: '', location: '', salary: '' });
      fetchOpportunities();
    } catch { toast.error('Failed to create'); }
    finally { setCreating(false); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Opportunities</h1>
          <p className="text-gray-500 dark:text-dark-400 mt-1">Explore jobs, internships, and more</p>
        </div>
        {(user?.role === 'alumni' || user?.role === 'admin') && (
          <Button onClick={() => setShowCreate(true)} size="md"><Plus size={18} /> Post Opportunity</Button>
        )}
      </motion.div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search opportunities..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {['', 'job', 'internship', 'freelance'].map(t => (
            <Badge key={t || 'all'} color={typeFilter === t ? 'primary' : 'gray'} size="md"
              className="cursor-pointer" onClick={() => setTypeFilter(t)}>
              {t ? t.charAt(0).toUpperCase() + t.slice(1) : 'All'}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <Briefcase className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="text-gray-500 text-lg">No opportunities found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {opportunities.map(opp => <OpportunityCard key={opp._id} opportunity={opp} onUpdate={fetchOpportunities} />)}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Post Opportunity" maxWidth="max-w-xl">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Job Title *" placeholder="e.g., Frontend Engineer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Company *" placeholder="e.g., Google" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Description *</label>
            <textarea className="input-field min-h-[100px] resize-none" placeholder="Describe the role..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="job">Job</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <Input label="Location" placeholder="Remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Salary" placeholder="e.g., ₹20-30 LPA" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            <Input label="Skills (comma separated)" placeholder="React, Node.js" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </div>
          <Button type="submit" loading={creating} className="w-full" size="lg">Post Opportunity</Button>
        </form>
      </Modal>
    </div>
  );
}
