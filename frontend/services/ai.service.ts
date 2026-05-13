import { getSession } from "./session.service";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface InteractionPair {
  drug_a: string;
  drug_b: string;
  severity: "SAFE" | "MODERATE" | "DANGEROUS";
  reason: string;
  recommendation: string;
}

export interface InteractionResult {
  overall_risk: "SAFE" | "MODERATE" | "DANGEROUS";
  summary: string;
  pairs: InteractionPair[];
  ai_insight?: string;
  drug_properties?: Array<{ name: string; class: string }>;
}

export const AiService = {
  checkInteractions: async (drugs: string[]): Promise<InteractionResult> => {
    const session = await getSession();
    const res = await fetch(`${BASE_URL}/ai/check-interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data?.token}`,
      },
      body: JSON.stringify({ drugs }),
    });
    
    if (!res.ok) {
      throw new Error("Failed to check interactions");
    }
    
    const json = await res.json();
    return json.data;
  },

  getInteractionHistory: async (page = 1, limit = 10) => {
    const session = await getSession();
    const res = await fetch(`${BASE_URL}/ai/interactions?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${session.data?.token}`,
      },
    });
    
    if (!res.ok) {
      return [];
    }
    
    const json = await res.json();
    return (json.data || []).map((item: any) => ({
      id: item.id,
      date: new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      drugs: item.drugsChecked.join(", "),
      maxRisk: item.overallRisk,
      status: "Reviewed", // Default to Reviewed since it's history
    }));
  },
};
