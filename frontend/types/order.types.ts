export type OrderStatus = "PENDING" | "SHIPPED" | "RECEIVED" | "CANCELLED";

export interface OrderItem {
  id: string;
  drugId: string;
  drug: {
    name: string;
    genericName: string;
    category: string;
  };
  quantity: number;
  unitPrice: number;
}

export interface SupplierOrder {
  id: string;
  supplierName: string;
  status: OrderStatus;
  totalAmount: number;
  itemsCount: number;
  expectedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderFilters {
  status?: OrderStatus | "";
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrderResponse {
  data: SupplierOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateOrderPayload {
  supplierName: string;
  expectedDelivery?: string;
  lineItems: {
    drugId: string;
    quantity: number;
    unitPrice: number;
  }[];
}
