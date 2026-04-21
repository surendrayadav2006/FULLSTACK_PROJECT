export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return <div className={`skeleton ${width} ${height}`} />;
}

export function SkeletonCircle({ size = 'w-12 h-12' }) {
  return <div className={`skeleton ${size} rounded-full`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonCircle />
        <div className="space-y-2 flex-1">
          <SkeletonLine width="w-1/2" />
          <SkeletonLine width="w-3/4" height="h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLine width="w-5/6" />
        <SkeletonLine width="w-2/3" />
      </div>
      <div className="flex gap-2">
        <SkeletonLine width="w-16" height="h-6" />
        <SkeletonLine width="w-20" height="h-6" />
        <SkeletonLine width="w-14" height="h-6" />
      </div>
    </div>
  );
}
