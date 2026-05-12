"use client";

import { Pencil, Trash2, Package } from "lucide-react";
import type { InventoryItem } from "@/types/inventory.types";
import InventoryStatusBadge from "./InventoryStatusBadge";

interface Props {
  items?: InventoryItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

const formatCurrency = (val: number | string) =>
  `৳${parseFloat(String(val)).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const CATEGORY_COLORS: Record<string, string> = {
  ANTIBIOTIC: "bg-blue-50 text-blue-700",
  ANALGESIC: "bg-purple-50 text-purple-700",
  ANTIDIABETIC: "bg-rose-50 text-rose-700",
  CARDIOVASCULAR: "bg-red-50 text-red-700",
  VITAMIN: "bg-lime-50 text-lime-700",
  RESPIRATORY: "bg-cyan-50 text-cyan-700",
  ANTIFUNGAL: "bg-orange-50 text-orange-700",
  ANTIVIRAL: "bg-indigo-50 text-indigo-700",
  ANTIHISTAMINE: "bg-teal-50 text-teal-700",
  GASTROINTESTINAL: "bg-yellow-50 text-yellow-700",
  PSYCHIATRIC: "bg-violet-50 text-violet-700",
  OTHER: "bg-gray-100 text-gray-600",
};

export default function InventoryTable({
  items = [],
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEdit,
  onDelete,
}: Props) {
  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < items.length;

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
          <Package size={28} className="text-sky-400" />
        </div>
        <p className="text-gray-700 font-semibold">No inventory items found</p>
        <p className="text-sm text-gray-400 mt-1">
          Try adjusting your filters or add a new item.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              <th className="pl-4 pr-2 py-3 w-10">
                <input
                  id="inventory-select-all"
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-400"
                  aria-label="Select all"
                />
              </th>
              {[
                "Drug",
                "Category",
                "Qty",
                "Unit Price",
                "Expiry Date",
                "Reorder Lvl",
                "Batch / Supplier",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isExpiringSoon = (() => {
                const days =
                  (new Date(item.expiryDate).getTime() - Date.now()) /
                  86_400_000;
                return days > 0 && days <= 30;
              })();

              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isSelected ? "bg-sky-50/60" : "hover:bg-gray-50/50"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="pl-4 pr-2 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(item.id)}
                      className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-400"
                      aria-label={`Select ${item.drug?.name}`}
                    />
                  </td>

                  {/* Drug */}
                  <td className="px-3 py-3 min-w-[160px]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                        <Package size={16} className="text-sky-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-[140px]">
                          {item.drug?.name ?? "—"}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">
                          {item.drug?.genericName ?? ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        CATEGORY_COLORS[item.drug?.category] ??
                        CATEGORY_COLORS.OTHER
                      }`}
                    >
                      {item.drug?.category?.replace(/_/g, " ") ?? "—"}
                    </span>
                  </td>

                  {/* Qty */}
                  <td className="px-3 py-3 tabular-nums font-semibold text-gray-800">
                    {item.quantity.toLocaleString()}
                  </td>

                  {/* Unit Price */}
                  <td className="px-3 py-3 tabular-nums text-gray-600 whitespace-nowrap">
                    {formatCurrency(item.unitPrice)}
                  </td>

                  {/* Expiry */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={
                        isExpiringSoon
                          ? "text-amber-600 font-medium"
                          : "text-gray-600"
                      }
                    >
                      {formatDate(item.expiryDate)}
                    </span>
                    {isExpiringSoon && (
                      <p className="text-xs text-amber-500 mt-0.5">
                        Expiring soon
                      </p>
                    )}
                  </td>

                  {/* Reorder level */}
                  <td className="px-3 py-3 text-gray-600 tabular-nums">
                    {item.reorderLevel}
                  </td>

                  {/* Batch / Supplier */}
                  <td className="px-3 py-3 min-w-[130px]">
                    <p className="text-gray-700 text-xs">
                      {item.batchNumber || (
                        <span className="text-gray-300">—</span>
                      )}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {item.supplierName || (
                        <span className="text-gray-300">—</span>
                      )}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <InventoryStatusBadge status={item.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        id={`edit-item-${item.id}`}
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition"
                        aria-label={`Edit ${item.drug?.name}`}
                        title="Edit item"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        id={`delete-item-${item.id}`}
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition"
                        aria-label={`Delete ${item.drug?.name}`}
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
