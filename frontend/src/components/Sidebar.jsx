import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MessageCircle, Briefcase, UserCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/discover', icon: Users, label: 'Discover' },
  { to: '/mentorship', icon: Users, label: 'Mentorship' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-20 h-[calc(100vh-5rem)]">
      <nav className="glass rounded-2xl p-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500 shadow-sm'
                  : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 border-l-4 border-transparent'
              }`
            }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500 shadow-sm' : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 border-l-4 border-transparent'
              }`
            }>
            <Shield size={18} /> Admin
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
