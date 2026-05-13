"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Loader2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Search,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { OrderService } from "@/services/order.service";
import { DrugService } from "@/services/drug.service";
import type { Drug } from "@/types/drug.types";
import { motion, AnimatePresence } from "framer-motion";

const orderItemSchema = z.object({
  drugId: z.string().min(1, "Please select a drug"),
  drugName: z.string(), // for UI display
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0.01, "Price must be at least 0.01"),
});

const createOrderSchema = z.object({
  supplierName: z.string().min(2, "Supplier name is required"),
  expectedDeliveryDate: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

type OrderFormValues = z.infer<typeof createOrderSchema>;

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateOrderModalProps) {
  const [step, setStep] = useState(1);
  const [drugSearch, setDrugSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      supplierName: "",
      expectedDeliveryDate: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");
  const totalAmount = watchItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );

  // Search drugs
  useEffect(() => {
    if (drugSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await DrugService.getDrugs({ search: drugSearch, limit: 5 });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Drug search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [drugSearch]);

  const handleAddDrug = (drug: Drug) => {
    // Check if drug already exists in items
    const exists = watchItems.some((item) => item.drugId === drug.id);
    if (exists) {
      toast.error("Drug already added to order");
      return;
    }

    append({
      drugId: drug.id,
      drugName: drug.name,
      quantity: 1,
      unitPrice: (drug as any).price || 150, // Default to 150 if not set, or use previously set price
    });
    setDrugSearch("");
    setSearchResults([]);
  };

  const onSubmit = async (data: OrderFormValues) => {
    if (step !== 3) return;

    try {
      let expectedDelivery: string | undefined = undefined;
      if (data.expectedDeliveryDate) {
        // Backend validation expects ISO datetime format
        expectedDelivery = new Date(data.expectedDeliveryDate).toISOString();
      }

      await OrderService.createOrder({
        supplierName: data.supplierName,
        expectedDelivery,
        lineItems: data.items.map((item) => ({
          drugId: item.drugId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      toast.success("Purchase order created successfully");
      onSuccess();
      onClose();
      reset();
      setStep(1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create order");
    }
  };

  if (!isOpen) return null;

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Create Supplier Order</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-1.5 w-10 rounded-full ${step >= 1 ? "bg-sky-500" : "bg-gray-200"}`}></span>
              <span className={`h-1.5 w-10 rounded-full ${step >= 2 ? "bg-sky-500" : "bg-gray-200"}`}></span>
              <span className={`h-1.5 w-10 rounded-full ${step >= 3 ? "bg-sky-500" : "bg-gray-200"}`}></span>
              <span className="text-[10px] font-medium text-gray-400 uppercase ml-2">Step {step} of 3</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="order-form" onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Supplier Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("supplierName")}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="e.g. Acme Pharma Ltd."
                    />
                    {errors.supplierName && (
                      <p className="text-red-500 text-xs mt-1">{errors.supplierName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Expected Delivery Date
                    </label>
                    <input
                      type="date"
                      {...register("expectedDeliveryDate")}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Drug Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Search and Add Drugs
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={drugSearch}
                        onChange={(e) => setDrugSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault();
                        }}
                        placeholder="Type drug name..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                      )}
                    </div>

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                      {searchResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                        >
                          {searchResults.map((drug) => (
                            <button
                              key={drug.id}
                              type="button"
                              onClick={() => handleAddDrug(drug)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group border-b border-gray-50 last:border-0"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-sky-600 transition-colors">
                                  {drug.name}
                                </p>
                                <p className="text-xs text-gray-500">{drug.genericName} • {drug.category}</p>
                              </div>
                              <Plus size={16} className="text-gray-400 group-hover:text-sky-500" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Added Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Order Items ({fields.length})
                    </h4>
                    {fields.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                        <Package className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No items added yet. Search above to add drugs.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-end"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">
                                {watchItems[index]?.drugName}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5 uppercase">Price: ৳{watchItems[index]?.unitPrice.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto items-end">
                              <div className="flex-1 sm:w-32">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantity</label>
                                <input
                                  type="number"
                                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                              </div>
                              <div className="hidden sm:block sm:w-24 px-3 py-1.5 text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Subtotal</p>
                                <p className="text-sm font-bold text-gray-900">৳{((watchItems[index]?.quantity || 0) * (watchItems[index]?.unitPrice || 0)).toLocaleString()}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.items && (
                      <p className="text-red-500 text-xs mt-1">{errors.items.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Supplier</p>
                      <p className="text-lg font-bold text-sky-900">{watch("supplierName")}</p>
                    </div>
                    {watch("expectedDeliveryDate") && (
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Expected By</p>
                        <p className="text-sm font-medium text-sky-900">{watch("expectedDeliveryDate")}</p>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100 font-bold text-gray-600 uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Item</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Price</th>
                          <th className="px-4 py-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {watchItems.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-medium text-gray-900">{item.drugName}</td>
                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">৳{item.unitPrice.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                              ৳{(item.quantity * item.unitPrice).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50/50 font-bold">
                        <tr>
                          <td colSpan={3} className="px-4 py-4 text-right text-gray-500 uppercase tracking-wider">Total Amount</td>
                          <td className="px-4 py-4 text-right text-lg text-[#0EA5E9]">
                            ৳{totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg h-fit text-amber-600">
                      <ChevronRight size={16} />
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      By confirming, you will create a <span className="font-bold">PENDING</span> purchase order. Inventory will only be updated once the order is marked as <span className="font-bold text-green-600 uppercase">Received</span>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={
                (step === 1 && !watch("supplierName")) || 
                (step === 2 && watchItems.length === 0)
              }
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-xl transition-colors text-sm font-medium disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Confirm & Create Order"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
