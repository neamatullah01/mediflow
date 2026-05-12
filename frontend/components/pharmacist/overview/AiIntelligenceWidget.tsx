import { Sparkles } from "lucide-react";
import { DashboardService } from "@/services/dashboard.service";

export default async function AiIntelligenceWidget() {
  const alerts = await DashboardService.getAlerts();

  return (
    <div className="lg:col-span-2 p-6 rounded-xl border border-[#0EA5E9]/30 bg-sky-50/30 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-[#0EA5E9]" size={24} />
        <h2 className="text-xl font-bold text-gray-900">
          AI Stock Intelligence
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {alerts.map((alert, index) => (
          <div 
            key={alert.id} 
            className={`p-4 rounded-xl bg-white border shadow-sm ${
              alert.type === 'stock' ? 'border-sky-100' : 'border-emerald-100'
            }`}
          >
            <h3 className={`text-sm font-semibold mb-2 ${
              alert.type === 'stock' ? 'text-sky-600' : 'text-emerald-600'
            }`}>
              {alert.type === 'stock' ? 'Predictive Restock' : 'Inventory Optimization'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {alert.message}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors">
          View Intelligence Report &rarr;
        </button>
      </div>
    </div>
  );
}
