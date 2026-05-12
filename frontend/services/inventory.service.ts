import { api } from "@/lib/api";
import type {
  InventoryFilters,
  InventoryResponse,
  InventoryItem,
  AddInventoryPayload,
  UpdateInventoryPayload,
  AlertItem,
} from "@/types/inventory.types";

// ─────────────────────────────────────────────────────────────────────────────
// Inventory Service — MediFlow
// All calls use the configured Axios instance (withCredentials: true).
// ─────────────────────────────────────────────────────────────────────────────

export const InventoryService = {
  /**
   * GET /inventory
   * Fetch paginated, filtered, sorted inventory for the authenticated pharmacy.
   */
  getInventory: async (
    params?: InventoryFilters
  ): Promise<InventoryResponse> => {
    // Strip empty string params so we don't send ?category=&status=
    const cleanParams: Record<string, unknown> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== "" && value !== undefined && value !== null) {
          cleanParams[key] = value;
        }
      }
    }

    const response = await api.get("/inventory", { params: cleanParams });
    const json = response.data;

    // Normalize all backend response shapes:
    //  Shape A: { data: InventoryItem[], meta: {} }
    //  Shape B: { data: { data: InventoryItem[], meta: {} } }
    const EMPTY_META = { total: 0, page: 1, limit: 20, totalPages: 0 };
    const candidate = json?.data?.data !== undefined ? json.data : json;

    if (Array.isArray(candidate?.data)) {
      return { data: candidate.data, meta: candidate.meta ?? EMPTY_META };
    }
    if (Array.isArray(candidate)) {
      return { data: candidate, meta: EMPTY_META };
    }
    return { data: [], meta: EMPTY_META };
  },

  /**
   * GET /inventory/:id
   * Fetch a single inventory item by ID.
   */
  getInventoryItem: async (id: string): Promise<InventoryItem> => {
    const response = await api.get<{ data: InventoryItem }>(
      `/inventory/${id}`
    );
    return response.data.data;
  },

  /**
   * POST /inventory
   * Add a new item to the pharmacy's inventory.
   */
  addInventoryItem: async (
    payload: AddInventoryPayload
  ): Promise<InventoryItem> => {
    const response = await api.post<{ data: InventoryItem }>(
      "/inventory",
      payload
    );
    return response.data.data;
  },

  /**
   * PATCH /inventory/:id
   * Update an existing inventory item.
   */
  updateInventoryItem: async (
    id: string,
    payload: UpdateInventoryPayload
  ): Promise<InventoryItem> => {
    const response = await api.patch<{ data: InventoryItem }>(
      `/inventory/${id}`,
      payload
    );
    return response.data.data;
  },

  /**
   * DELETE /inventory/:id
   * Remove a single inventory item.
   */
  deleteInventoryItem: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },

  /**
   * DELETE /inventory  (body: { ids: string[] })
   * Bulk-delete multiple inventory items.
   */
  bulkDeleteInventoryItems: async (ids: string[]): Promise<void> => {
    await api.delete("/inventory", { data: { ids } });
  },

  /**
   * GET /inventory/alerts/low-stock
   * Fetch items where quantity <= reorderLevel.
   */
  getLowStockAlerts: async (): Promise<AlertItem[]> => {
    const response = await api.get<{ data: AlertItem[] }>(
      "/inventory/alerts/low-stock"
    );
    return response.data.data ?? [];
  },

  /**
   * GET /inventory/alerts/expiring
   * Fetch items expiring within the next 30 days.
   */
  getExpiryAlerts: async (): Promise<AlertItem[]> => {
    const response = await api.get<{ data: AlertItem[] }>(
      "/inventory/alerts/expiring"
    );
    return response.data.data ?? [];
  },

  /**
   * GET /inventory/export
   * Download the pharmacy's inventory as a CSV file.
   * Returns a Blob — the caller should create an object URL.
   */
  exportInventoryCSV: async (): Promise<Blob> => {
    const response = await api.get("/inventory/export", {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};
