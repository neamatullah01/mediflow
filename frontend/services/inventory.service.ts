import { api } from "@/lib/api";

export const InventoryService = {
  getInventory: async (params?: Record<string, any>) => {
    try {
      const response = await api.get("/inventory", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch inventory", error);
      return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
  },
};
