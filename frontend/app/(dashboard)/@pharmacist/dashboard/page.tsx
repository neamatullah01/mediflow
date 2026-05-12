import AiIntelligenceWidget from "@/components/pharmacist/overview/AiIntelligenceWidget";
import DashboardCharts from "@/components/pharmacist/overview/DashboardCharts";
import KpiCards from "@/components/pharmacist/overview/KpiCards";
import OverviewHeader from "@/components/pharmacist/overview/OverviewHeader";
import TopDispensedWidget from "@/components/pharmacist/overview/TopDispensedWidget";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview | MediFlow",
  description: "Pharmacy operational status and inventory intelligence.",
};

export default function PharmacistDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <OverviewHeader />
      <KpiCards />
      <DashboardCharts />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopDispensedWidget />
        <AiIntelligenceWidget />
      </div>
    </div>
  );
}
