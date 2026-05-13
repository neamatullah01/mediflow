"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DispensingService } from "@/services/dispensing.service";

// Zod Schema for validation
const dispenseSchema = z.object({
  inventoryItemId: z.string().min(1, "Please select a medication"),
  quantityDispensed: z.number().min(1, "Quantity must be at least 1"),
  patientName: z.string().optional(),
});

type DispenseFormValues = z.infer<typeof dispenseSchema>;

interface NewDispenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Call this to refresh the table data
}

export default function NewDispenseModal({
  isOpen,
  onClose,
  onSuccess,
}: NewDispenseModalProps) {
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DispenseFormValues>({
    resolver: zodResolver(dispenseSchema),
    defaultValues: { quantityDispensed: 1, patientName: "" },
  });

  // Fetch inventory when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchInventory = async () => {
        setIsLoadingInventory(true);
        try {
          // Fetching inventory to populate the dropdown
          const data = await DispensingService.getAvailableInventory();
          if (data) {
            setInventory(data);
          }
        } catch (error) {
          toast.error("Failed to load inventory");
        } finally {
          setIsLoadingInventory(false);
        }
      };
      fetchInventory();
    } else {
      reset(); // Clean form when closed
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: DispenseFormValues) => {
    try {
      // Find the selected inventory item to get the drugId
      const selectedItem = inventory.find(
        (item) => item.id === data.inventoryItemId,
      );
      if (!selectedItem) throw new Error("Invalid item selected");

      // Ensure we don't dispense more than we have in stock
      if (data.quantityDispensed > selectedItem.quantity) {
        toast.error(`Only ${selectedItem.quantity} units available in stock.`);
        return;
      }

      // Record the dispense event via the service
      await DispensingService.recordDispensing({
        inventoryItemId: data.inventoryItemId,
        drugId: selectedItem.drugId,
        quantity: data.quantityDispensed,
        patientName: data.patientName,
      });

      toast.success("Dispense recorded successfully");
      onSuccess(); // Triggers the table to refresh
      onClose(); // Closes the modal
    } catch (error: any) {
      toast.error(error.message || "Failed to record dispense");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">New Dispense</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Record a medication given to a patient.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Medication Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Medication <span className="text-red-500">*</span>
            </label>
            <select
              {...register("inventoryItemId")}
              disabled={isLoadingInventory}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            >
              <option value="">
                {isLoadingInventory
                  ? "Loading medications..."
                  : "Select a medication..."}
              </option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.drug?.name} (Stock: {item.quantity})
                </option>
              ))}
            </select>
            {errors.inventoryItemId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.inventoryItemId.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quantity to Dispense <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("quantityDispensed", { valueAsNumber: true })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. 10"
              min="1"
            />
            {errors.quantityDispensed && (
              <p className="text-red-500 text-xs mt-1">
                {errors.quantityDispensed.message}
              </p>
            )}
          </div>

          {/* Patient Name (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Patient Name{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              {...register("patientName")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-xl transition-colors text-sm font-medium disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Confirm Dispense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
