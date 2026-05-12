"use client";

import { useState } from "react";
import { Plus, Download, Sparkles, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { InventoryService } from "@/services/inventory.service";

interface Props {
  selectedCount: number;
  onBulkDelete: () => void;
  onAdd: () => void;
  isBulkDeleting?: boolean;
}

export default function InventoryHeader({
  selectedCount,
  onBulkDelete,
  onAdd,
  isBulkDeleting = false,
}: Props) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await InventoryService.exportInventoryCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Inventory exported successfully");
    } catch {
      toast.error("Failed to export inventory");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Inventory Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage your pharmacy's medicine stock levels and expiry dates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Bulk delete — visible when items are selected */}
          {selectedCount > 0 && (
            <button
              id="inventory-bulk-delete-btn"
              onClick={onBulkDelete}
              disabled={isBulkDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-sm font-medium transition shadow-sm"
            >
              {isBulkDeleting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              Delete {selectedCount} selected
            </button>
          )}

          {/* Export CSV */}
          <button
            id="inventory-export-btn"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition shadow-sm"
          >
            {isExporting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            Export CSV
          </button>

          {/* Add item */}
          <button
            id="inventory-add-btn"
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition shadow-sm"
          >
            <Plus size={15} />
            Add Item
          </button>
        </div>
      </div>

      {/* AI Forecast banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-sky-50 border border-violet-200/60">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
          <Sparkles size={18} className="text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-violet-900">
            AI Demand Forecast Available
          </p>
          <p className="text-xs text-violet-600 mt-0.5">
            Predict stock-outs before they happen — generate a 14-day AI forecast.
          </p>
        </div>
        <Link
          href="/dashboard/inventory/forecast"
          id="inventory-forecast-link"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition"
        >
          <Sparkles size={12} />
          View Forecast
        </Link>
      </div>
    </div>
  );
}
