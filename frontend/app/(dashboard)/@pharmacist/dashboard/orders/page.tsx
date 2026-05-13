"use client";

import OrderTable from "@/components/pharmacist/orders/OrderTable";
import CreateOrderModal from "@/components/pharmacist/orders/CreateOrderModal";
import OrderDetailsModal from "@/components/pharmacist/orders/OrderDetailsModal";
import { useState } from "react";
import type { SupplierOrder } from "@/types/order.types";
import { OrderService } from "@/services/order.service";

// Note: Metadata cannot be in a "use client" file. 
// For SEO, we would normally put this in a layout or a separate server component wrapper,
// but for this dashboard page, we'll focus on functionality.

export default function SupplierOrdersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleViewOrder = async (order: SupplierOrder) => {
    try {
      // Fetch full order details including items
      const fullOrder = await OrderService.getOrderById(order.id);
      setSelectedOrder(fullOrder);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch order details", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Supplier Orders
          </h1>
          <p className="text-sm text-gray-500">
            Track your purchase history and restock inventory from global suppliers.
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          Live Sync Active
        </div>
      </div>

      <OrderTable 
        onViewOrder={handleViewOrder} 
        onCreateOrder={() => setIsCreateModalOpen(true)}
        refreshTrigger={refreshTrigger}
      />

      <CreateOrderModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefresh}
      />

      <OrderDetailsModal 
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdate={handleRefresh}
      />
    </div>
  );
}
