"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types/inventory.types";

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function InventoryPagination({ meta, onPageChange }: Props) {
  const { page, totalPages, total, limit } = meta;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page numbers to show (max 5 around current page)
  const pages: (number | "…")[] = [];
  const delta = 2;
  const left = Math.max(1, page - delta);
  const right = Math.min(totalPages, page + delta);

  if (left > 1) { pages.push(1); if (left > 2) pages.push("…"); }
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages) { if (right < totalPages - 1) pages.push("…"); pages.push(totalPages); }

  const btnBase =
    "h-9 w-9 flex items-center justify-center rounded-lg text-sm font-medium border transition";
  const btnActive = "bg-sky-500 text-white border-sky-500 shadow-sm";
  const btnDefault =
    "bg-white text-gray-600 border-gray-200 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300";
  const btnDisabled = "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-700">{from}–{to}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> items
      </p>

      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          id="inventory-prev-page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`${btnBase} ${page <= 1 ? btnDisabled : btnDefault}`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              id={`inventory-page-${p}`}
              onClick={() => onPageChange(p as number)}
              className={`${btnBase} ${p === page ? btnActive : btnDefault}`}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          id="inventory-next-page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`${btnBase} ${page >= totalPages ? btnDisabled : btnDefault}`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
