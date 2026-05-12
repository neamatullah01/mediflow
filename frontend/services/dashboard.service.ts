import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Cache the response so multiple server components calling this don't hit the backend multiple times
import { cache } from "react";

const fetchDashboardStats = cache(async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${BASE_URL}/pharmacies/dashboard-stats`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    console.error("Failed to fetch dashboard stats", e);
  }
  return null;
});

export const DashboardService = {
  getPharmacistStats: async () => {
    const data = await fetchDashboardStats();
    if (data?.kpiCards) {
      return {
        totalItems: data.kpiCards.totalItems ?? 0,
        totalItemsChange: data.kpiCards.totalItemsChange ?? "+0%",
        lowStock: data.kpiCards.lowStock ?? 0,
        expiringSoon: data.kpiCards.expiringSoon ?? 0,
        totalDispensed: data.kpiCards.totalDispensed ?? 0,
      };
    }
    
    // Fallback if data is malformed
    return {
      totalItems: 0,
      totalItemsChange: "0%",
      lowStock: 0,
      expiringSoon: 0,
      totalDispensed: 0,
    };
  },
  
  getDispensingActivity: async () => {
    const data = await fetchDashboardStats();
    if (data?.dispensingActivity) {
      return data.dispensingActivity;
    }
    
    return [];
  },

  getInventoryMix: async () => {
    const data = await fetchDashboardStats();
    if (data?.inventoryMix) {
      return data.inventoryMix;
    }
    
    return [];
  },

  getTopDispensed: async () => {
    const data = await fetchDashboardStats();
    if (data?.topDispensed) {
      return data.topDispensed;
    }
    
    return [];
  },
  
  getAlerts: async () => {
    // Keeping this mocked as it was not part of the dashboard-stats endpoint requirements
    return [
      { 
        id: "1", 
        type: "stock", 
        message: "Amoxicillin usage is projected to increase by 15% next week based on local seasonal health patterns. Recommend ordering 50 additional units.", 
        urgency: "high", 
        item: "Amoxicillin" 
      },
      { 
        id: "2", 
        type: "expiry", 
        message: "Three items in 'Dermatology' have had zero turnover in 90 days. AI suggests reducing base stock levels to free up capital.", 
        urgency: "medium", 
        item: "Dermatology" 
      },
    ];
  }
};
