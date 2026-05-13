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
    try {
      const session = await getSession();
      const res = await fetch(`${BASE_URL}/ai/check-interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.token}`,
        },
        body: JSON.stringify({ drugs }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn("Backend not ready, using mock AI interaction data");
    }

    // Mock data perfectly matching your screenshot
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          overall_risk: "DANGEROUS",
          summary:
            "Concurrent use of these medications presents a high risk of adverse events.",
          ai_insight:
            "Based on cumulative risk factors and current drug entry, the cumulative bleeding risk is in the 94th percentile for their age bracket (65+).",
          drug_properties: [
            { name: "Warfarin", class: "Anticoagulant" },
            { name: "Aspirin", class: "Antiplatelet" },
            { name: "Simvastatin", class: "HMG-CoA Reductase" },
          ],
          pairs: [
            {
              drug_a: "Warfarin",
              drug_b: "Aspirin",
              severity: "DANGEROUS",
              reason:
                "Concurrent use of anticoagulants and antiplatelet agents significantly increases the risk of serious bleeding complications, including gastrointestinal hemorrhage.",
              recommendation:
                "Avoid combination unless benefits outweigh bleeding risks. Monitor PT/INR frequently if co-administration is necessary. Consider safer alternatives for pain management.",
            },
            {
              drug_a: "Warfarin",
              drug_b: "Simvastatin",
              severity: "MODERATE",
              reason:
                "Simvastatin may enhance the anticoagulant effect of warfarin by inhibiting its metabolism or through unknown mechanisms, potentially increasing INR.",
              recommendation:
                "Monitor INR closely when initiating or changing simvastatin dose. Adjust warfarin dosage as needed based on lab results.",
            },
          ],
        });
      }, 1500); // Simulate AI thinking time
    });
  },

  getInteractionHistory: async () => {
    // Mock history matching your design
    return [
      {
        id: "1",
        date: "Oct 24, 09:15 AM",
        drugs: "Lisinopril, Spironolactone, Metformin",
        maxRisk: "MODERATE",
        status: "Reviewed",
      },
      {
        id: "2",
        date: "Oct 23, 04:30 PM",
        drugs: "Clopidogrel, Omeprazole",
        maxRisk: "DANGEROUS",
        status: "Pending Action",
      },
      {
        id: "3",
        date: "Oct 23, 11:20 AM",
        drugs: "Amoxicillin, Probiotic Acidophilus",
        maxRisk: "SAFE",
        status: "Reviewed",
      },
    ];
  },
};
