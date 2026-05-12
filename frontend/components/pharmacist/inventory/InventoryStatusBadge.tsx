"use client";

import type { InventoryStatus } from "@/types/inventory.types";

const CONFIG: Record<
  InventoryStatus,
  { label: string; classes: string }
> = {
  IN_STOCK: {
    label: "In Stock",
    classes:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-200/50",
  },
  LOW_STOCK: {
    label: "Low Stock",
    classes:
      "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-200/50",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    classes:
      "bg-gray-100 text-gray-600 border border-gray-200 ring-1 ring-gray-200/50",
  },
  EXPIRED: {
    label: "Expired",
    classes:
      "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-200/50",
  },
};

interface Props {
  status: InventoryStatus;
}

export default function InventoryStatusBadge({ status }: Props) {
  const cfg = CONFIG[status] ?? CONFIG.IN_STOCK;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.classes}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === "IN_STOCK"
            ? "bg-emerald-500"
            : status === "LOW_STOCK"
              ? "bg-amber-500"
              : status === "EXPIRED"
                ? "bg-red-500"
                : "bg-gray-400"
        }`}
      />
      {cfg.label}
    </span>
  );
}
