import { api } from "@/lib/api";

export const DispensingService = {
  recordDispensing: async (data: { inventoryItemId: string; drugId: string; quantity: number; patientName?: string }) => {
    const response = await api.post("/dispensing", data);
    return response.data;
  },
};
