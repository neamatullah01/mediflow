"use client";

import { useState } from "react";
import {
  X,
  Truck,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { OrderService } from "@/services/order.service";
import type { SupplierOrder, OrderStatus } from "@/types/order.types";
import { format } from "date-fns";

interface OrderDetailsModalProps {
  order: SupplierOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onUpdate,
}: OrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await OrderService.updateOrderStatus(order.id, newStatus);
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return "text-amber-600 bg-amber-50 border-amber-100";
      case "SHIPPED": return "text-blue-600 bg-blue-50 border-blue-100";
      case "RECEIVED": return "text-green-600 bg-green-50 border-green-100";
      case "CANCELLED": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Order Details
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-mono uppercase tracking-tighter">
              ID: {order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Summary Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Supplier</p>
                  <p className="text-sm font-bold text-gray-900">{order.supplierName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ordered On</p>
                  <p className="text-sm font-medium text-gray-700">
                    {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Total Amount</p>
                  <p className="text-xl font-black text-sky-600">৳{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              {order.expectedDeliveryDate && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expected Delivery</p>
                    <p className="text-sm font-medium text-gray-700">
                      {format(new Date(order.expectedDeliveryDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Items</h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 font-bold text-gray-600 uppercase">
                  <tr>
                    <th className="px-4 py-3">Medication</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{item.drug.name}</p>
                        <p className="text-[10px] text-gray-500">{item.drug.genericName}</p>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">৳{item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        ৳{(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warnings */}
          {order.status === "PENDING" && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={18} />
              <p className="text-xs text-amber-700 leading-relaxed">
                This order is currently <span className="font-bold">Pending</span>. Once the items arrive at your pharmacy, mark this order as <span className="font-bold">Received</span> to automatically update your inventory stock levels.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          {(order.status === "PENDING" || order.status === "SHIPPED") && (
            <>
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("CANCELLED")}
                className="flex-1 px-4 py-2.5 border border-red-200 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel Order
              </button>
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("RECEIVED")}
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors text-sm font-medium shadow-sm disabled:opacity-70"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Mark as Received
              </button>
            </>
          )}
          {order.status === "RECEIVED" && (
            <div className="w-full text-center py-2.5 text-green-600 font-bold text-sm bg-green-50 rounded-xl border border-green-100 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              Stock Updated Successfully
            </div>
          )}
          {order.status === "CANCELLED" && (
            <div className="w-full text-center py-2.5 text-red-600 font-bold text-sm bg-red-50 rounded-xl border border-red-100 flex items-center justify-center gap-2">
              <AlertTriangle size={16} />
              Order Terminated
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
