import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Moon, Sun, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getNotifications, markAllRead } from '../services/notificationService';
import Avatar from './ui/Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/discover?search=${searchQuery}`);
  };

  const handleMarkAllRead = async () => {
    try { await markAllRead(); setUnreadCount(0); } catch {}
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10 dark:border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">AlumniSphere</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search alumni, skills, opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode */}
            <motion.button whileTap={{ scale: 0.9 }} onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-dark-600" />}
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors relative">
                <Bell size={20} className="text-dark-600 dark:text-dark-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl shadow-glass-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
                      <h3 className="font-semibold text-dark-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-xs text-primary-500 hover:text-primary-600 font-medium">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-gray-500">No notifications yet</p>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <Link key={n._id} to={n.link || '#'} onClick={() => setShowNotifications(false)}
                            className={`block p-3 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors border-b border-gray-100 dark:border-dark-700/50 ${!n.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                            <p className="text-sm font-medium text-dark-900 dark:text-white">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                <Avatar src={user?.avatar} name={user?.name || ''} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-dark-700 dark:text-dark-300 max-w-[100px] truncate">{user?.name}</span>
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl shadow-glass-lg overflow-hidden">
                    <div className="p-3 border-b border-gray-200 dark:border-dark-700">
                      <p className="font-semibold text-dark-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/profile" onClick={() => setShowProfile(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-dark-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                        <User size={16} /> My Profile
                      </Link>
                      <button onClick={() => { logout(); navigate('/'); setShowProfile(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700">
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
