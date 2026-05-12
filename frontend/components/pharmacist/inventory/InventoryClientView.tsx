"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { InventoryService } from "@/services/inventory.service";
import type {
  InventoryItem,
  InventoryFilters as InventoryFilterParams,
  InventoryResponse,
} from "@/types/inventory.types";

import InventoryHeader from "./InventoryHeader";
import InventoryFiltersBar from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryPagination from "./InventoryPagination";
import AddInventoryModal from "./AddInventoryModal";
import EditInventoryModal from "./EditInventoryModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const DEFAULT_FILTERS: InventoryFilterParams = {
  search: "",
  category: "",
  status: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 20,
};

interface Props {
  /** Initial SSR data — avoids a loading flash on first paint */
  initialData: InventoryResponse;
}

export default function InventoryClientView({ initialData }: Props) {
  // ── Data state ───────────────────────────────────────────────────────────
  const [data, setData] = useState<InventoryResponse>({
    data: Array.isArray(initialData?.data) ? initialData.data : [],
    meta: initialData?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 0 },
  });
  const [filters, setFilters] = useState<InventoryFilterParams>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);

  // ── Selection state ──────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── Modal state ──────────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch inventory ──────────────────────────────────────────────────────
  const fetchInventory = useCallback(
    async (newFilters: InventoryFilterParams) => {
      setIsLoading(true);
      try {
        const result = await InventoryService.getInventory(newFilters);
        setData({
          data: Array.isArray(result?.data) ? result.data : [],
          meta: result?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 0 },
        });
        setSelectedIds([]); // clear selection on refresh
      } catch {
        toast.error("Failed to load inventory");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Re-fetch whenever filters change (skip on mount — we already have SSR data)
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    fetchInventory(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // ── Filter change handler ────────────────────────────────────────────────
  const handleFilterChange = useCallback(
    (updated: Partial<InventoryFilterParams>) => {
      setFilters((prev) => ({ ...prev, ...updated }));
    },
    []
  );

  // ── Selection handlers ───────────────────────────────────────────────────
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? data.data.map((i) => i.id) : []);
    },
    [data.data]
  );

  // ── Edit handler ─────────────────────────────────────────────────────────
  const handleEdit = useCallback((item: InventoryItem) => {
    setEditTarget(item);
  }, []);

  // ── Delete handlers ──────────────────────────────────────────────────────
  const handleDeleteRequest = useCallback((item: InventoryItem) => {
    setDeleteTarget(item);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await InventoryService.deleteInventoryItem(deleteTarget.id);
      toast.success(`${deleteTarget.drug?.name ?? "Item"} removed`);
      setDeleteTarget(null);
      fetchInventory(filters);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDeleteRequest = useCallback(() => {
    if (selectedIds.length === 0) return;
    setShowBulkDeleteDialog(true);
  }, [selectedIds]);

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await InventoryService.bulkDeleteInventoryItems(selectedIds);
      toast.success(`${selectedIds.length} items deleted`);
      setShowBulkDeleteDialog(false);
      setSelectedIds([]);
      fetchInventory(filters);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete items");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Page change ──────────────────────────────────────────────────────────
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <InventoryHeader
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDeleteRequest}
        onAdd={() => setShowAddModal(true)}
        isBulkDeleting={isDeleting && showBulkDeleteDialog}
      />

      {/* Filters */}
      <InventoryFiltersBar filters={filters} onChange={handleFilterChange} />

      {/* Table or skeleton */}
      {isLoading ? (
        <InventoryTableSkeleton />
      ) : (
        <InventoryTable
          items={data.data}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      )}

      {/* Pagination */}
      {!isLoading && (
        <InventoryPagination
          meta={data.meta}
          onPageChange={handlePageChange}
        />
      )}

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AddInventoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={() => fetchInventory(filters)}
      />

      <EditInventoryModal
        open={!!editTarget}
        onOpenChange={(open) => { if (!open) setEditTarget(null); }}
        item={editTarget}
        onSuccess={() => fetchInventory(filters)}
      />

      {/* Single delete */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        drugName={deleteTarget?.drug?.name}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting && !!deleteTarget}
      />

      {/* Bulk delete */}
      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        count={selectedIds.length}
        onConfirm={handleConfirmBulkDelete}
        isLoading={isDeleting && showBulkDeleteDialog}
      />
    </div>
  );
}
