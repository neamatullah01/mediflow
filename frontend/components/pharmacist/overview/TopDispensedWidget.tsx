import { DashboardService } from "@/services/dashboard.service";

interface TopDispensedItem {
  id?: string;
  name: string;
  qty: number;
  trend?: string;
}

export default async function TopDispensedWidget() {
  const topDispensed: TopDispensedItem[] = await DashboardService.getTopDispensed();
  // find max for scaling the progress bar
  const maxUnits = Math.max(...topDispensed.map(d => d.qty), 250);

  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Top 5 Dispensed</h2>
      <div className="space-y-5 flex-1">
        {topDispensed.map((drug) => (
          <div key={drug.name}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-gray-700">{drug.name}</span>
              <span className="font-bold text-gray-900">
                {drug.qty}{" "}
                <span className="text-xs font-normal text-gray-500">units</span>
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-sky-600 h-2 rounded-full"
                style={{ width: `${(drug.qty / maxUnits) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
