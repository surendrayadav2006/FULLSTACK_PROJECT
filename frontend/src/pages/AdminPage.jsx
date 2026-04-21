import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Shield, TrendingUp } from 'lucide-react';
import { getUsers } from '../services/userService';
import StatsCard from '../components/StatsCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, alumni: 0, students: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await getUsers({ limit: 50 });
      setUsers(data.users);
      const alumni = data.users.filter(u => u.role === 'alumni').length;
      const students = data.users.filter(u => u.role === 'student').length;
      setStats({ total: data.total, alumni, students });
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white flex items-center gap-2">
          <Shield size={24} className="text-primary-500" /> Admin Panel
        </h1>
        <p className="text-gray-500 dark:text-dark-400 mt-1">Platform overview and user management</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard icon={Users} label="Total Users" value={stats.total} color="primary" />
        <StatsCard icon={Users} label="Alumni" value={stats.alumni} color="purple" />
        <StatsCard icon={Users} label="Students" value={stats.students} color="pink" />
        <StatsCard icon={TrendingUp} label="Active" value={users.length} color="emerald" />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-dark-700">
          <h2 className="font-bold text-dark-900 dark:text-white">All Users</h2>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-dark-700">
            {users.map(u => (
              <div key={u._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                <Avatar src={u.avatar} name={u.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-900 dark:text-white">{u.name}</p>
                  <p className="text-sm text-gray-500 truncate">{u.email}</p>
                </div>
                <Badge color={u.role === 'alumni' ? 'purple' : u.role === 'admin' ? 'red' : 'primary'}>
                  {u.role?.charAt(0).toUpperCase() + u.role?.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500 hidden md:block">{u.skills?.slice(0, 2).join(', ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
