"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { PackageSearch } from "lucide-react";
import { DrugService } from "@/services/drug.service";
import type {
  Drug,
  DrugFilters as DrugFilterState,
  DrugListResponse,
} from "@/types/drug.types";
import { DrugSearchBar } from "./DrugSearchBar";
import { DrugFilters, type FilterState } from "./DrugFilters";
import { DrugCard } from "./DrugCard";
import { DrugCardSkeleton } from "./DrugCardSkeleton";
import { DrugPagination } from "./DrugPagination";

const DEFAULT_FILTERS: FilterState = {
  category: "",
  dosageForm: "",
  manufacturer: "",
  sort: "name_asc",
};

export function DrugSearchView() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<DrugListResponse>({
    data: [],
    meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
  });
  const [isPending, startTransition] = useTransition();
  const [initialLoad, setInitialLoad] = useState(true);

  // ─── Fetch on any filter/search/page change ──────────────────────────────
  const fetchDrugs = useCallback(() => {
    startTransition(async () => {
      const params: DrugFilterState = {
        search: search || undefined,
        category: filters.category || undefined,
        dosageForm: filters.dosageForm || undefined,
        manufacturer: filters.manufacturer || undefined,
        sort: (filters.sort as any) || "name_asc",
        page,
        limit: 12,
      };
      const result = await DrugService.getDrugs(params);
      setResponse(result);
      setInitialLoad(false);
    });
  }, [search, filters, page]);

  useEffect(() => {
    fetchDrugs();
  }, [fetchDrugs]);

  // Reset to page 1 on filter/search change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const isLoading = isPending || initialLoad;
  const { data: drugs, meta } = response;

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <DrugSearchBar value={search} onChange={handleSearchChange} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Sidebar Filters ── */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0 bg-card rounded-2xl border border-border/50 p-5 shadow-sm sticky top-24">
          <DrugFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            totalResults={meta.total}
          />
        </aside>

        {/* ── Main Grid ── */}
        <main className="flex-1 min-w-0">
          {/* Results count */}
          {!isLoading && (
            <p className="text-sm text-muted-foreground mb-5 transition-opacity">
              {meta.total > 0
                ? `Showing ${(page - 1) * 12 + 1}–${Math.min(page * 12, meta.total)} of ${meta.total} drugs`
                : "No drugs found"}
            </p>
          )}

          {/* Loading skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <DrugCardSkeleton key={i} />
              ))}
            </div>
          ) : drugs.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <PackageSearch className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  No drugs found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-primary hover:underline font-medium mt-1"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            /* Drug grid — 4 cols 2xl, 3 lg, 2 sm, 1 mobile */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
              {drugs.map((drug: Drug, i: number) => (
                <DrugCard key={drug.id} drug={drug} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && meta.totalPages > 1 && (
            <div className="mt-10">
              <DrugPagination
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
