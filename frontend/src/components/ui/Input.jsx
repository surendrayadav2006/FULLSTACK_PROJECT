export default function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:ring-red-400/50' : ''}`} {...props} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
