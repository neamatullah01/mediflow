"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { InventoryService } from "@/services/inventory.service";
import type { InventoryItem, UpdateInventoryPayload } from "@/types/inventory.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onSuccess: () => void;
}

export default function EditInventoryModal({
  open,
  onOpenChange,
  item,
  onSuccess,
}: Props) {
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when the item changes
  useEffect(() => {
    if (item) {
      setQuantity(String(item.quantity));
      setUnitPrice(String(item.unitPrice));
      // Format date for <input type="date"> → YYYY-MM-DD
      setExpiryDate(
        item.expiryDate ? item.expiryDate.split("T")[0] : ""
      );
      setBatchNumber(item.batchNumber ?? "");
      setReorderLevel(String(item.reorderLevel));
      setSupplierName(item.supplierName ?? "");
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    const payload: UpdateInventoryPayload = {
      quantity: parseInt(quantity),
      unitPrice: parseFloat(unitPrice),
      expiryDate: new Date(expiryDate).toISOString(),
      batchNumber: batchNumber || undefined,
      reorderLevel: parseInt(reorderLevel) || 10,
      supplierName: supplierName || undefined,
    };

    setIsSubmitting(true);
    try {
      await InventoryService.updateInventoryItem(item.id, payload);
      toast.success(`${item.drug?.name ?? "Item"} updated successfully`);
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to update inventory item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Edit Inventory Item</DialogTitle>
          <DialogDescription className="text-gray-500">
            Update stock details for{" "}
            <span className="font-semibold text-gray-700">
              {item?.drug?.name ?? "this item"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {item && (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Drug info (read-only) */}
            <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-sm font-semibold text-gray-800">
                {item.drug?.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.drug?.genericName} · {item.drug?.category} ·{" "}
                {item.drug?.dosageForm}
              </p>
            </div>

            {/* Row: Qty + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-quantity">Quantity *</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-unit-price">Unit Price (৳) *</Label>
                <Input
                  id="edit-unit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Row: Expiry + Batch */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-expiry">Expiry Date *</Label>
                <Input
                  id="edit-expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-batch">Batch Number</Label>
                <Input
                  id="edit-batch"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="e.g. BT-2025-001"
                />
              </div>
            </div>

            {/* Row: Reorder + Supplier */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-reorder">Reorder Level</Label>
                <Input
                  id="edit-reorder"
                  type="number"
                  min="0"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-supplier">Supplier</Label>
                <Input
                  id="edit-supplier"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. MedSupply BD"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                id="edit-inventory-cancel"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                id="edit-inventory-submit"
                type="submit"
                disabled={isSubmitting}
                className="bg-sky-500 hover:bg-sky-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
