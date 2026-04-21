export default function Avatar({ src, name = '', size = 'md', online, className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  const dotSizes = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3', xl: 'w-4 h-4' };
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={`relative inline-flex ${className}`}>
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-dark-800`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-dark-800`}>
          {initials || '?'}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full border-2 border-white dark:border-dark-800 ${online ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      )}
    </div>
  );
}
