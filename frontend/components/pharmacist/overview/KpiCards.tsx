import {
  PackageSearch,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { DashboardService } from "@/services/dashboard.service";

export default async function KpiCards() {
  const stats = await DashboardService.getPharmacistStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Items */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
            <PackageSearch size={20} />
          </div>
          <span className="text-xs font-semibold text-emerald-500">
            {stats.totalItemsChange}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total items</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalItems.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Low Stock (Danger) */}
      <div className="p-5 rounded-xl border border-red-200 bg-red-50/30 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-red-100 rounded-lg text-[#EF4444]">
            <AlertTriangle size={20} />
          </div>
          <span className="text-xs font-semibold text-[#EF4444]">Alert</span>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Low stock</p>
          <h3 className="text-2xl font-bold text-[#EF4444]">
            {stats.lowStock}
          </h3>
        </div>
      </div>

      {/* Expiring Soon (Warning) */}
      <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-amber-100 rounded-lg text-[#F59E0B]">
            <CalendarClock size={20} />
          </div>
          <span className="text-xs font-semibold text-[#F59E0B]">
            Action Needed
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Expiring soon</p>
          <h3 className="text-2xl font-bold text-[#F59E0B]">
            {stats.expiringSoon}
          </h3>
        </div>
      </div>

      {/* Total Dispensed */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-emerald-50 rounded-lg text-[#10B981]">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-xs font-semibold text-gray-500">Today</span>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total dispensed</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.totalDispensed.toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}
