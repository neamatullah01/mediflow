"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
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
import type { AddInventoryPayload, Drug } from "@/types/inventory.types";
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddInventoryModal({ open, onOpenChange, onSuccess }: Props) {
  const [drugSearch, setDrugSearch] = useState("");
  const [drugResults, setDrugResults] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [reorderLevel, setReorderLevel] = useState("10");
  const [supplierName, setSupplierName] = useState("");

  const resetForm = () => {
    setDrugSearch("");
    setDrugResults([]);
    setSelectedDrug(null);
    setQuantity("");
    setUnitPrice("");
    setExpiryDate("");
    setBatchNumber("");
    setReorderLevel("10");
    setSupplierName("");
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  // Debounced drug search against master catalogue
  useEffect(() => {
    if (!drugSearch.trim() || selectedDrug) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get<{ data: Drug[] }>("/drugs", {
          params: { search: drugSearch.trim(), limit: 10 },
        });
        setDrugResults(res.data.data ?? []);
      } catch {
        /* silent */
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [drugSearch, selectedDrug]);

  const handleSelectDrug = (drug: Drug) => {
    setSelectedDrug(drug);
    setDrugSearch(drug.name);
    setDrugResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDrug) {
      toast.error("Please select a drug from the catalogue");
      return;
    }

    const payload: AddInventoryPayload = {
      drugId: selectedDrug.id,
      quantity: parseInt(quantity),
      unitPrice: parseFloat(unitPrice),
      expiryDate: new Date(expiryDate).toISOString(),
      batchNumber: batchNumber || undefined,
      reorderLevel: parseInt(reorderLevel) || 10,
      supplierName: supplierName || undefined,
    };

    setIsSubmitting(true);
    try {
      await InventoryService.addInventoryItem(payload);
      toast.success(`${selectedDrug.name} added to inventory`);
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to add inventory item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add Inventory Item</DialogTitle>
          <DialogDescription className="text-gray-500">
            Search for a drug in the master catalogue and add it to your stock.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Drug search */}
          <div className="space-y-1.5">
            <Label htmlFor="add-drug-search">Drug (Master Catalogue) *</Label>
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                id="add-drug-search"
                type="text"
                placeholder="Type drug name to search…"
                value={drugSearch}
                onChange={(e) => {
                  setDrugSearch(e.target.value);
                  if (selectedDrug) setSelectedDrug(null);
                }}
                className={`${inputClass} pl-9`}
                autoComplete="off"
                required
              />
              {isSearching && (
                <Loader2
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
                />
              )}
            </div>

            {/* Dropdown results */}
            {drugResults.length > 0 && !selectedDrug && (
              <ul className="mt-1 rounded-xl border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto z-10 divide-y divide-gray-50">
                {drugResults.map((drug) => (
                  <li key={drug.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectDrug(drug)}
                      className="w-full text-left px-4 py-2.5 hover:bg-sky-50 transition"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {drug.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {drug.genericName} · {drug.category}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Selected drug chip */}
            {selectedDrug && (
              <div className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-200 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sky-700 truncate">
                    {selectedDrug.name}
                  </p>
                  <p className="text-xs text-sky-500">
                    {selectedDrug.category} · {selectedDrug.dosageForm}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedDrug(null); setDrugSearch(""); }}
                  className="text-sky-400 hover:text-sky-600 text-xs shrink-0"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Row: Qty + Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-quantity">Quantity *</Label>
              <Input
                id="add-quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 100"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-unit-price">Unit Price (৳) *</Label>
              <Input
                id="add-unit-price"
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="e.g. 5.50"
                required
              />
            </div>
          </div>

          {/* Row: Expiry + Batch */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-expiry">Expiry Date *</Label>
              <Input
                id="add-expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-batch">Batch Number</Label>
              <Input
                id="add-batch"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. BT-2025-001"
              />
            </div>
          </div>

          {/* Row: Reorder Level + Supplier */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-reorder">Reorder Level</Label>
              <Input
                id="add-reorder"
                type="number"
                min="0"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-supplier">Supplier</Label>
              <Input
                id="add-supplier"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g. MedSupply BD"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              id="add-inventory-cancel"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              id="add-inventory-submit"
              type="submit"
              disabled={isSubmitting || !selectedDrug}
              className="bg-sky-500 hover:bg-sky-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" /> Adding…
                </>
              ) : (
                "Add to Inventory"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
