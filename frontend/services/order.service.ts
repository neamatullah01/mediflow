import { api } from "@/lib/api";
import type {
  OrderFilters,
  OrderResponse,
  SupplierOrder,
  CreateOrderPayload,
  OrderStatus,
} from "@/types/order.types";

export const OrderService = {
  /**
   * GET /orders
   * Fetch paginated and filtered supplier orders.
   */
  getOrders: async (params?: OrderFilters): Promise<OrderResponse> => {
    const cleanParams: Record<string, unknown> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== "" && value !== undefined && value !== null) {
          cleanParams[key] = value;
        }
      }
    }

    const response = await api.get("/orders", { params: cleanParams });
    const json = response.data;

    const EMPTY_META = { total: 0, page: 1, limit: 10, totalPages: 0 };
    const candidate = json?.data?.data !== undefined ? json.data : json;

    if (Array.isArray(candidate?.data)) {
      return { data: candidate.data, meta: candidate.meta ?? EMPTY_META };
    }
    if (Array.isArray(candidate)) {
      return { data: candidate, meta: EMPTY_META };
    }
    return { data: [], meta: EMPTY_META };
  },

  /**
   * GET /orders/:id
   * Fetch a single order with its items.
   */
  getOrderById: async (id: string): Promise<SupplierOrder> => {
    const response = await api.get<{ data: SupplierOrder }>(`/orders/${id}`);
    return response.data.data;
  },

  /**
   * POST /orders
   * Create a new supplier order.
   */
  createOrder: async (payload: CreateOrderPayload): Promise<SupplierOrder> => {
    const response = await api.post<{ data: SupplierOrder }>(
      "/orders",
      payload,
    );
    return response.data.data;
  },

  /**
   * PATCH /orders/:id/status
   * Update order status (PENDING, SHIPPED, RECEIVED, CANCELLED).
   */
  updateOrderStatus: async (
    id: string,
    status: OrderStatus,
  ): Promise<SupplierOrder> => {
    const response = await api.patch<{ data: SupplierOrder }>(
      `/orders/${id}/status`,
      { status },
    );
    return response.data.data;
  },

  /**
   * DELETE /orders/:id
   * Delete an order.
   */
  deleteOrder: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
