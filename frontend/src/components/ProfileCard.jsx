import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './ui/Avatar';
import ProgressBar from './ui/ProgressBar';
import Badge from './ui/Badge';

export default function ProfileCard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="glass rounded-2xl p-5 mb-4">
      <div className="text-center">
        <Avatar src={user.avatar} name={user.name} size="xl" className="mx-auto" />
        <h3 className="mt-3 font-bold text-dark-900 dark:text-white">{user.name}</h3>
        <p className="text-sm text-gray-500 dark:text-dark-400">{user.headline || 'Add a headline'}</p>
        <Badge color={user.role === 'alumni' ? 'purple' : user.role === 'admin' ? 'red' : 'primary'} className="mt-2">
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
        </Badge>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
        <ProgressBar value={user.profileStrength || 0} label="Profile Strength" size="sm" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-dark-700/50">
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{user.connections?.length || 0}</p>
          <p className="text-xs text-gray-500">Connections</p>
        </div>
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-dark-700/50">
          <p className="text-lg font-bold text-accent-600 dark:text-accent-400">{user.profileViews || 0}</p>
          <p className="text-xs text-gray-500">Profile Views</p>
        </div>
      </div>
      <Link to="/profile" className="block mt-4 text-center text-sm text-primary-500 hover:text-primary-600 font-medium">
        View Profile →
      </Link>
    </div>
  );
}
