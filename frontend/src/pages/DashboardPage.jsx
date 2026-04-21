import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserCheck, Briefcase, Eye, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStats, getRecommendations, getTrendingSkills, getLeaderboard } from '../services/userService';
import { getOpportunities } from '../services/opportunityService';
import StatsCard from '../components/StatsCard';
import ProfileCard from '../components/ProfileCard';
import AlumniCard from '../components/AlumniCard';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, recsRes, trendRes, leaderRes, oppsRes] = await Promise.all([
        getStats(), getRecommendations(), getTrendingSkills(), getLeaderboard(),
        getOpportunities({ limit: 3 }),
      ]);
      setStats(statsRes.data.stats);
      setRecommendations(recsRes.data.recommendations);
      setTrending(trendRes.data.skills);
      setLeaderboard(leaderRes.data.leaderboard);
      setOpportunities(oppsRes.data.opportunities);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 bg-gradient-card">
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 dark:text-dark-400 mt-1">Here's what's happening in your network.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard icon={Users} label="Connections" value={stats?.connections || 0} color="primary" />
        <StatsCard icon={UserCheck} label="Active Mentorships" value={stats?.activeMentorships || 0} color="purple" />
        <StatsCard icon={Briefcase} label="Pending Requests" value={stats?.pendingRequests || 0} color="pink" />
        <StatsCard icon={Eye} label="Profile Views" value={stats?.profileViews || 0} color="emerald" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Center - Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
                <Zap size={20} className="text-amber-500" /> Recommended Mentors
              </h2>
              <Link to="/discover" className="text-sm text-primary-500 hover:text-primary-600 font-medium">View All →</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {recommendations.length > 0 ? (
                recommendations.slice(0, 4).map(rec => <AlumniCard key={rec._id} user={rec} />)
              ) : (
                <p className="col-span-2 text-center text-gray-500 py-8 glass rounded-2xl">
                  Add skills to your profile to get personalized recommendations!
                </p>
              )}
            </div>
          </div>

          {/* Recent Opportunities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
                <Briefcase size={20} className="text-primary-500" /> Latest Opportunities
              </h2>
              <Link to="/opportunities" className="text-sm text-primary-500 hover:text-primary-600 font-medium">View All →</Link>
            </div>
            <div className="space-y-3">
              {opportunities.map(opp => (
                <motion.div key={opp._id} whileHover={{ x: 4 }} className="glass rounded-xl p-4 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-dark-900 dark:text-white">{opp.title}</h3>
                      <p className="text-sm text-primary-500">{opp.company} · {opp.location}</p>
                    </div>
                    <Badge color={opp.type === 'internship' ? 'purple' : 'primary'} size="sm">
                      {opp.type?.charAt(0).toUpperCase() + opp.type?.slice(1)}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Trending Skills */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-dark-900 dark:text-white flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-emerald-500" /> Trending Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {trending.slice(0, 10).map((s, i) => (
                <Badge key={s.name} color={['primary', 'purple', 'pink', 'green', 'amber'][i % 5]} size="sm">
                  {s.name} ({s.count})
                </Badge>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-dark-900 dark:text-white flex items-center gap-2 mb-4">
              🏆 Top Alumni
            </h3>
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((u, i) => (
                <Link key={u._id} to={`/profile/${u._id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                  }`}>{i + 1}</span>
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 dark:text-white truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.company || u.headline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
