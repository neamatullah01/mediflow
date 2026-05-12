export default function InventoryTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
      {/* Table header skeleton */}
      <div className="px-6 py-4 border-b border-gray-100 flex gap-4">
        {["w-1/6", "w-1/6", "w-1/12", "w-1/8", "w-1/8", "w-1/8", "w-1/12"].map(
          (w, i) => (
            <div key={i} className={`h-4 rounded bg-gray-200 ${w}`} />
          )
        )}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="px-6 py-4 border-b border-gray-50 flex items-center gap-4"
        >
          {/* Drug name + badge column */}
          <div className="flex items-center gap-3 w-1/6">
            <div className="h-9 w-9 rounded-lg bg-gray-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 rounded bg-gray-200 w-3/4" />
              <div className="h-3 rounded bg-gray-100 w-1/2" />
            </div>
          </div>
          {/* Category */}
          <div className="h-5 rounded-full bg-gray-200 w-20" />
          {/* Qty */}
          <div className="h-4 rounded bg-gray-200 w-10" />
          {/* Price */}
          <div className="h-4 rounded bg-gray-200 w-16" />
          {/* Expiry */}
          <div className="h-4 rounded bg-gray-200 w-24" />
          {/* Status */}
          <div className="h-5 rounded-full bg-gray-200 w-20" />
          {/* Actions */}
          <div className="ml-auto flex gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-200" />
            <div className="h-8 w-8 rounded-lg bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
