import Link from "next/link";
import { Pill, Building2, ArrowRight } from "lucide-react";
import type { Drug } from "@/types/drug.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  ANTIBIOTIC:     "bg-emerald-500/10 text-emerald-600",
  ANALGESIC:      "bg-amber-500/10 text-amber-600",
  ANTIDIABETIC:   "bg-rose-500/10 text-rose-600",
  CARDIOVASCULAR: "bg-blue-500/10 text-blue-600",
  VITAMIN:        "bg-orange-500/10 text-orange-600",
  RESPIRATORY:    "bg-cyan-500/10 text-cyan-600",
  GASTROINTESTINAL: "bg-lime-500/10 text-lime-600",
  DERMATOLOGY:    "bg-pink-500/10 text-pink-600",
  NEUROLOGY:      "bg-purple-500/10 text-purple-600",
  ONCOLOGY:       "bg-red-500/10 text-red-600",
  OTHER:          "bg-slate-500/10 text-slate-600",
};

function formatEnum(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1550572017-edb3df14a9ce?auto=format&fit=crop&w=600&q=80",
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  drug: Drug;
  index?: number;
}

export function DrugCard({ drug, index = 0 }: Props) {
  const badgeClass = CATEGORY_COLORS[drug.category] ?? CATEGORY_COLORS.OTHER;
  const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <div className="group flex flex-col h-full rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Drug Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={drug.imageUrl ?? fallback}
          alt={drug.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallback;
          }}
        />
        {/* Category badge overlay */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}>
          {formatEnum(drug.category)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 md:p-5 gap-2">
        {/* Name */}
        <h3 className="font-semibold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {drug.name}
        </h3>

        {/* Generic name */}
        <p className="text-xs text-muted-foreground italic line-clamp-1">
          {drug.genericName}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Pill className="h-3.5 w-3.5 text-primary/70" />
            {formatEnum(drug.dosageForm)}
          </span>
          {drug.manufacturer && (
            <span className="flex items-center gap-1 truncate">
              <Building2 className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{drug.manufacturer}</span>
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-border/40">
          <Link
            href={`/drugs/${drug.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/link"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
