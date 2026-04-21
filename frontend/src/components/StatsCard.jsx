import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, label, value, trend, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    emerald: 'from-emerald-500 to-emerald-600',
  };

  return (
    <motion.div whileHover={{ y: -2, scale: 1.02 }} className="glass rounded-2xl p-5 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-400">{label}</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white mt-1">{value}</p>
          {trend && <p className="text-xs text-emerald-500 mt-1">↑ {trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}
