"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { InventoryService } from "@/services/inventory.service";
import { DispensingService } from "@/services/dispensing.service";

export default function NewDispenseButton() {
  const [open, setOpen] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    if (open) {
      loadInventory();
    }
  }, [open]);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const result = await InventoryService.getInventory({ limit: 100 });
      setInventory(result.data || []);
    } catch (error) {
      toast.error("Failed to load inventory items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedItem = inventory.find((item) => item.id === selectedItemId);
    if (!selectedItem) return;

    if (parseInt(quantity) > selectedItem.quantity) {
      toast.error("Insufficient stock available");
      return;
    }

    setIsSubmitting(true);
    try {
      await DispensingService.recordDispensing({
        inventoryItemId: selectedItem.id,
        drugId: selectedItem.drugId || selectedItem.drug?.id,
        quantity: parseInt(quantity),
        patientName: patientName || undefined,
      });

      toast.success("Dispense recorded successfully");
      setOpen(false);

      // Optionally trigger a page refresh or revalidation
      // window.location.reload();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to record dispense",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-xl transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} />
          New Dispense
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-xl border border-gray-200">
        <DialogHeader>
          <DialogTitle>Record New Dispense</DialogTitle>
          <DialogDescription>
            Record a new medication dispense from your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="drug">Select Drug *</Label>
            <select
              id="drug"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              disabled={isLoading}
              required
            >
              <option value="" disabled>
                {isLoading ? "Loading inventory..." : "Select an item..."}
              </option>
              {inventory.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  disabled={item.quantity <= 0}
                >
                  {item.drug?.name || "Unknown Drug"} - Stock: {item.quantity}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name (Optional)</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Recording..." : "Record Dispense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
