import { api } from "@/lib/api";

export interface DispensingLog {
  id: string;
  drug: { name: string; category: string };
  quantityDispensed: number;
  patientName: string | null;
  pharmacist: { name: string };
  dispensedAt: string;
}

export const DispensingService = {
  // Existing methods (from previous step)
  getAvailableInventory: async () => {
    const response = await api.get("/inventory", { params: { limit: 100 } });
    const json = response.data;
    const candidate = json?.data?.data !== undefined ? json.data : json;

    if (Array.isArray(candidate?.data)) {
      return candidate.data;
    }
    if (Array.isArray(candidate)) {
      return candidate;
    }
    return [];
  },
  // --- NEW METHODS ---
  getDispensingLogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const cleanParams: Record<string, unknown> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== "" && value !== undefined && value !== null) {
          cleanParams[key] = value;
        }
      }
    }

    const response = await api.get("/dispensing", { params: cleanParams });
    const json = response.data;

    const EMPTY_META = { total: 0, page: 1, limit: 10, totalPages: 0 };
    const candidate = json?.data?.data !== undefined ? json.data : json;

    if (Array.isArray(candidate?.data)) {
      return { data: candidate.data, meta: candidate.meta ?? EMPTY_META };
    }
    if (Array.isArray(candidate)) {
      return { data: candidate, meta: EMPTY_META };
    }
    return { data: [], meta: EMPTY_META };
  },

  deleteDispensingLog: async (id: string) => {
    await api.delete(`/dispensing/${id}`);
    return true;
  },

  recordDispensing: async (data: {
    inventoryItemId: string;
    drugId: string;
    quantity: number;
    patientName?: string;
  }) => {
    const response = await api.post("/dispensing", data);
    return response.data;
  },
};
