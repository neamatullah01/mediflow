import { Download } from "lucide-react";
import NewDispenseButton from "./NewDispenseButton";

export default function OverviewHeader() {
  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Pharmacy Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Operational status and inventory intelligence for {currentDate}.
        </p>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
          <Download size={16} />
          Export Report
        </button>
        <NewDispenseButton />
      </div>
    </div>
  );
}
