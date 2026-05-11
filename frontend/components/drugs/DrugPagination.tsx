"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DrugPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 5 page numbers with ellipsis logic
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const visible = getVisiblePages();
  const showStartEllipsis = visible[0]! > 1;
  const showEndEllipsis = visible[visible.length - 1]! < totalPages;

  return (
    <nav
      aria-label="Drug search pagination"
      className="flex items-center justify-center gap-1.5 flex-wrap"
    >
      {/* Prev */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg border-border/60 hover:bg-primary/5 hover:border-primary/30 transition-colors"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* First page + ellipsis */}
      {showStartEllipsis && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="icon"
            className="h-9 w-9 rounded-lg border-border/60 text-sm transition-colors"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          <span className="text-muted-foreground text-sm px-1">…</span>
        </>
      )}

      {/* Visible page numbers */}
      {visible.map((p) => (
        <Button
          key={p}
          size="icon"
          className={`h-9 w-9 rounded-lg text-sm transition-all ${
            p === currentPage
              ? "bg-primary text-primary-foreground shadow-sm"
              : "variant-outline border border-border/60 bg-background text-foreground hover:bg-primary/5 hover:border-primary/30"
          }`}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </Button>
      ))}

      {/* Ellipsis + last page */}
      {showEndEllipsis && (
        <>
          <span className="text-muted-foreground text-sm px-1">…</span>
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="icon"
            className="h-9 w-9 rounded-lg border-border/60 text-sm transition-colors"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg border-border/60 hover:bg-primary/5 hover:border-primary/30 transition-colors"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
