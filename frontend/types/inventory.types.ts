// ─────────────────────────────────────────────────────────────────────────────
// Inventory Domain Types — MediFlow
// ─────────────────────────────────────────────────────────────────────────────

export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRED";

export type DrugCategory =
  | "ANTIBIOTIC"
  | "ANALGESIC"
  | "ANTIDIABETIC"
  | "CARDIOVASCULAR"
  | "VITAMIN"
  | "RESPIRATORY"
  | "ANTIFUNGAL"
  | "ANTIVIRAL"
  | "ANTIHISTAMINE"
  | "GASTROINTESTINAL"
  | "PSYCHIATRIC"
  | "OTHER";

export type DosageForm =
  | "TABLET"
  | "CAPSULE"
  | "SYRUP"
  | "INJECTION"
  | "CREAM"
  | "INHALER"
  | "DROPS";

// ─── Drug (from master catalogue, embedded in inventory response) ────────────
export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: DrugCategory;
  dosageForm: DosageForm;
  manufacturer?: string | null;
  imageUrl?: string | null;
}

// ─── Inventory Item ──────────────────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  pharmacyId: string;
  drugId: string;
  quantity: number;
  unitPrice: number | string; // Prisma Decimal serialised as string from API
  expiryDate: string; // ISO date string
  batchNumber?: string | null;
  reorderLevel: number;
  supplierName?: string | null;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
  drug: Drug;
}

// ─── Pagination meta returned by the API ────────────────────────────────────
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Paginated inventory response ───────────────────────────────────────────
export interface InventoryResponse {
  data: InventoryItem[];
  meta: PaginationMeta;
}

// ─── Query params for GET /inventory ────────────────────────────────────────
export interface InventoryFilters {
  search?: string;
  category?: DrugCategory | "";
  status?: InventoryStatus | "";
  sortBy?: "name" | "quantity" | "expiryDate" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ─── Payload for POST /inventory ────────────────────────────────────────────
export interface AddInventoryPayload {
  drugId: string;
  quantity: number;
  unitPrice: number;
  expiryDate: string; // ISO string
  batchNumber?: string;
  reorderLevel?: number;
  supplierName?: string;
}

// ─── Payload for PATCH /inventory/:id ───────────────────────────────────────
export type UpdateInventoryPayload = Partial<AddInventoryPayload>;

// ─── Low-stock / expiry alert item ──────────────────────────────────────────
export interface AlertItem {
  id: string;
  drug: Drug;
  quantity: number;
  reorderLevel: number;
  expiryDate: string;
  batchNumber?: string | null;
  status: InventoryStatus;
}
