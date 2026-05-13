"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Calendar,
  FileText,
  X,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { OrderService } from "@/services/order.service";
import type { SupplierOrder, OrderStatus } from "@/types/order.types";
import { format } from "date-fns";

interface OrderTableProps {
  onViewOrder: (order: SupplierOrder) => void;
  onCreateOrder: () => void;
  refreshTrigger: number;
}

export default function OrderTable({ onViewOrder, onCreateOrder, refreshTrigger }: OrderTableProps) {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await OrderService.getOrders({
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      setOrders(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page, statusFilter, refreshTrigger]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "RECEIVED":
        return "bg-green-50 text-green-700 border-green-100";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1">
            <Filter size={14} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
              className="bg-transparent border-none text-xs focus:ring-0 p-1 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="SHIPPED">Shipped</option>
              <option value="RECEIVED">Received</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <button
          onClick={onCreateOrder}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-xl transition-colors text-sm font-medium shadow-sm w-full lg:w-auto"
        >
          <Plus size={16} />
          Create Order
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4 hidden md:table-cell">Items</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded-full w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-gray-200 rounded-lg ml-auto"></div></td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="bg-sky-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="text-sky-500 h-6 w-6" />
                  </div>
                  <h3 className="text-gray-900 font-medium">No orders found</h3>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or create a new order.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.supplierName}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ৳{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-500">
                    {order.itemsCount} items
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && orders.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing page <span className="font-medium text-gray-900">{page}</span> of{" "}
            <span className="font-medium text-gray-900">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
