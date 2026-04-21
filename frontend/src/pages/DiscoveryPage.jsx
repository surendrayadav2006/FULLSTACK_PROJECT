import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { getUsers } from '../services/userService';
import AlumniCard from '../components/AlumniCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const SKILL_FILTERS = ['React', 'Node.js', 'Python', 'Machine Learning', 'UI/UX', 'Product Management', 'Java', 'AWS', 'Data Analytics'];

export default function DiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedSkills.length) params.skills = selectedSkills.join(',');
      if (roleFilter) params.role = roleFilter;
      const { data } = await getUsers(params);
      setUsers(data.users);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedSkills, roleFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Discover Alumni</h1>
        <p className="text-gray-500 dark:text-dark-400 mt-1">Find mentors and connect with professionals</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by name, skills, or company..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge color={!roleFilter ? 'primary' : 'gray'} size="md" className="cursor-pointer" onClick={() => { setRoleFilter(''); setPage(1); }}>All</Badge>
          <Badge color={roleFilter === 'alumni' ? 'purple' : 'gray'} size="md" className="cursor-pointer" onClick={() => { setRoleFilter('alumni'); setPage(1); }}>Alumni</Badge>
          <Badge color={roleFilter === 'student' ? 'primary' : 'gray'} size="md" className="cursor-pointer" onClick={() => { setRoleFilter('student'); setPage(1); }}>Students</Badge>
          <span className="mx-2 border-l border-gray-300 dark:border-dark-600" />
          {SKILL_FILTERS.map(skill => (
            <button key={skill} onClick={() => toggleSkill(skill)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedSkills.includes(skill) ? 'bg-gradient-primary text-white' : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-dark-300 hover:bg-gray-200'}`}>
              {skill}
            </button>
          ))}
          {selectedSkills.length > 0 && (
            <button onClick={() => { setSelectedSkills([]); setPage(1); }} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <Users className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="text-gray-500 text-lg">No users found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => <AlumniCard key={u._id} user={u} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-gradient-primary text-white' : 'glass hover:bg-gray-100 dark:hover:bg-dark-700'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
