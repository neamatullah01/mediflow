import { OverviewCharts } from "@/components/charts/OverviewCharts";
import { DashboardService } from "@/services/dashboard.service";

export default async function DashboardCharts() {
  const dispensingData = await DashboardService.getDispensingActivity();
  const mixData = await DashboardService.getInventoryMix();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-5 rounded-xl border border-gray-200 bg-white shadow-sm min-h-[350px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Dispensing Activity
          </h2>
          <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="flex-1 w-full h-full">
          <OverviewCharts type="bar" data={dispensingData} />
        </div>
      </div>

      <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm min-h-[350px] flex flex-col">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Inventory Mix</h2>
        <div className="flex-1 w-full h-full relative">
          <OverviewCharts type="pie" data={mixData} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-12">
            <span className="text-2xl font-bold text-gray-900">{mixData.length}</span>
            <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">
              Classes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
