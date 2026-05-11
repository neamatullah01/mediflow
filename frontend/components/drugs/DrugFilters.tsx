"use client";

import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "ANTIBIOTIC", label: "Antibiotic" },
  { value: "ANALGESIC", label: "Analgesic" },
  { value: "ANTIDIABETIC", label: "Antidiabetic" },
  { value: "CARDIOVASCULAR", label: "Cardiovascular" },
  { value: "VITAMIN", label: "Vitamin" },
  { value: "RESPIRATORY", label: "Respiratory" },
  { value: "GASTROINTESTINAL", label: "Gastrointestinal" },
  { value: "DERMATOLOGY", label: "Dermatology" },
  { value: "NEUROLOGY", label: "Neurology" },
  { value: "OTHER", label: "Other" },
];

export const DOSAGE_FORMS = [
  { value: "", label: "All Forms" },
  { value: "TABLET", label: "Tablet" },
  { value: "CAPSULE", label: "Capsule" },
  { value: "SYRUP", label: "Syrup" },
  { value: "INJECTION", label: "Injection" },
  { value: "CREAM", label: "Cream" },
  { value: "DROPS", label: "Drops" },
  { value: "INHALER", label: "Inhaler" },
  { value: "OTHER", label: "Other" },
];

export const SORT_OPTIONS = [
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "newest", label: "Newest First" },
];

export interface FilterState {
  category: string;
  dosageForm: string;
  manufacturer: string;
  sort: string;
}

interface Props {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export function DrugFilters({ filters, onChange, onReset, totalResults }: Props) {
  const hasActiveFilters =
    filters.category || filters.dosageForm || filters.manufacturer || filters.sort !== "name_asc";

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
          {totalResults > 0 && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              ({totalResults} results)
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="filter-category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dosage Form */}
        <div className="space-y-2">
          <label htmlFor="filter-form" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dosage Form
          </label>
          <select
            id="filter-form"
            value={filters.dosageForm}
            onChange={(e) => onChange({ dosageForm: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          >
            {DOSAGE_FORMS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Manufacturer */}
        <div className="space-y-2">
          <label htmlFor="filter-manufacturer" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Manufacturer
          </label>
          <input
            id="filter-manufacturer"
            type="text"
            value={filters.manufacturer}
            onChange={(e) => onChange({ manufacturer: e.target.value })}
            placeholder="e.g. MediFlow Pharma..."
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label htmlFor="filter-sort" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sort By
          </label>
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full mt-6 rounded-xl border-primary/20 hover:bg-primary/5 text-primary text-sm font-medium"
          onClick={onReset}
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Clear All Filters
        </Button>
      )}
    </aside>
  );
}
