export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="h-14 w-64 animate-pulse rounded-full bg-slate-200/70" />
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-soft">
              <div className="h-56 animate-pulse rounded-[24px] bg-slate-200/70" />
              <div className="mt-4 h-6 w-3/4 animate-pulse rounded-full bg-slate-200/70" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-slate-100" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-6 flex items-center justify-between">
                <div className="h-8 w-28 animate-pulse rounded-full bg-slate-200/70" />
                <div className="h-11 w-32 animate-pulse rounded-full bg-orange-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
