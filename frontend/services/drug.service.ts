import type { Drug, DrugFilters, DrugListResponse } from "@/types/drug.types";

// Re-export types so consumers that already import from this path keep working
export type { Drug, DrugFilters, DrugListResponse };

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const DrugService = {
  /**
   * Fetches paginated drug list with filters.
   * Uses native fetch for Next.js App Router caching compatibility.
   */
  getDrugs: async (filters: DrugFilters = {}): Promise<DrugListResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.dosageForm) params.set("dosageForm", filters.dosageForm);
    if (filters.manufacturer) params.set("manufacturer", filters.manufacturer);
    if (filters.sort) params.set("sort", filters.sort);
    params.set("page", String(filters.page ?? 1));
    params.set("limit", String(filters.limit ?? 10));

    try {
      const res = await fetch(`${BASE_URL}/drugs?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch drugs");
      const json = await res.json();
      return {
        data: json.data ?? [],
        meta: json.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    } catch {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }
  },

  /**
   * Fetches a single drug by ID.
   */
  getDrugById: async (id: string): Promise<Drug | null> => {
    try {
      const res = await fetch(`${BASE_URL}/drugs/${id}`, { cache: "no-store" });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data ?? null;
    } catch {
      return null;
    }
  },

  /**
   * Fetches reviews for a specific drug.
   */
  getDrugReviews: async (id: string): Promise<any[]> => {
    try {
      const res = await fetch(`${BASE_URL}/drugs/${id}/reviews`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data ?? [];
    } catch {
      return [];
    }
  },
};
