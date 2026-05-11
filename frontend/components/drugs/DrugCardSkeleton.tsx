export function DrugCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden animate-pulse h-full">
      {/* Image placeholder */}
      <div className="w-full aspect-video bg-muted" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category badge */}
        <div className="h-5 w-24 bg-muted rounded-full" />

        {/* Name */}
        <div className="h-5 w-4/5 bg-muted rounded-md" />

        {/* Generic name */}
        <div className="h-4 w-3/5 bg-muted rounded-md" />

        <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          {/* Dosage form */}
          <div className="h-4 w-20 bg-muted rounded-md" />
          {/* Button */}
          <div className="h-8 w-24 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}
