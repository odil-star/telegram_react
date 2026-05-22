export function SkeletonCard() {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="h-40 animate-pulse bg-white/70" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded-full bg-white/80" />
        <div className="h-5 w-36 animate-pulse rounded-full bg-white/80" />
        <div className="h-4 w-full animate-pulse rounded-full bg-white/70" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse rounded-full bg-white/80" />
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/80" />
        </div>
      </div>
    </div>
  );
}
