import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, glass = true, padding = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        ${glass ? 'glass' : 'bg-white dark:bg-dark-800'}
        rounded-2xl shadow-glass
        ${hover ? 'card-hover' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
