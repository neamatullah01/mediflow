import InteractionCheckerClient from "@/components/pharmacist/ai/InteractionCheckerClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Interaction Checker | MediFlow",
  description:
    "Analyze potential drug-to-drug interactions with clinical precision using AI.",
};

export default function InteractionsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <InteractionCheckerClient />
    </div>
  );
}
