import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, max = 100, label, showValue = true, gradient = true, size = 'md' }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-dark-700 dark:text-dark-300">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{pct}%</span>}
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`${heights[size]} rounded-full ${gradient ? 'bg-gradient-primary' : 'bg-primary-500'}`}
        />
      </div>
    </div>
  );
}
