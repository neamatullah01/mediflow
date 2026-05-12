"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import type { DrugCategory, InventoryFilters, InventoryStatus } from "@/types/inventory.types";

const CATEGORIES: { label: string; value: DrugCategory | "" }[] = [
  { label: "All Categories", value: "" },
  { label: "Antibiotic", value: "ANTIBIOTIC" },
  { label: "Analgesic", value: "ANALGESIC" },
  { label: "Antidiabetic", value: "ANTIDIABETIC" },
  { label: "Cardiovascular", value: "CARDIOVASCULAR" },
  { label: "Vitamin", value: "VITAMIN" },
  { label: "Respiratory", value: "RESPIRATORY" },
  { label: "Antifungal", value: "ANTIFUNGAL" },
  { label: "Antiviral", value: "ANTIVIRAL" },
  { label: "Antihistamine", value: "ANTIHISTAMINE" },
  { label: "Gastrointestinal", value: "GASTROINTESTINAL" },
  { label: "Psychiatric", value: "PSYCHIATRIC" },
  { label: "Other", value: "OTHER" },
];

const STATUSES: { label: string; value: InventoryStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
  { label: "Expired", value: "EXPIRED" },
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Name A→Z", value: "name:asc" },
  { label: "Name Z→A", value: "name:desc" },
  { label: "Quantity ↑", value: "quantity:asc" },
  { label: "Quantity ↓", value: "quantity:desc" },
  { label: "Expiry ↑", value: "expiryDate:asc" },
  { label: "Expiry ↓", value: "expiryDate:desc" },
  { label: "Newest First", value: "createdAt:desc" },
];

interface Props {
  filters: InventoryFilters;
  onChange: (updated: Partial<InventoryFilters>) => void;
}

export default function InventoryFilters({ filters, onChange }: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ search: value, page: 1 });
    }, 300);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const sortValue =
    filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}:${filters.sortOrder}`
      : "createdAt:desc";

  const handleSort = (val: string) => {
    const [sortBy, sortOrder] = val.split(":") as [
      InventoryFilters["sortBy"],
      InventoryFilters["sortOrder"],
    ];
    onChange({ sortBy, sortOrder, page: 1 });
  };

  const hasActiveFilters =
    filters.search || filters.category || filters.status;

  const selectClass =
    "h-10 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition";

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          id="inventory-search"
          type="text"
          placeholder="Search by drug name…"
          defaultValue={filters.search ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition placeholder:text-gray-400"
        />
      </div>

      {/* Category */}
      <select
        id="inventory-category-filter"
        className={selectClass}
        value={filters.category ?? ""}
        onChange={(e) =>
          onChange({ category: e.target.value as DrugCategory | "", page: 1 })
        }
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        id="inventory-status-filter"
        className={selectClass}
        value={filters.status ?? ""}
        onChange={(e) =>
          onChange({ status: e.target.value as InventoryStatus | "", page: 1 })
        }
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        id="inventory-sort"
        className={selectClass}
        value={sortValue}
        onChange={(e) => handleSort(e.target.value)}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          id="inventory-clear-filters"
          onClick={() =>
            onChange({ search: "", category: "", status: "", page: 1 })
          }
          className="h-10 px-3 flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 hover:text-red-500 hover:border-red-300 transition shadow-sm"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}
