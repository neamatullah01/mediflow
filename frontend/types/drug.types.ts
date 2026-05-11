// ─── Drug Domain Types ────────────────────────────────────────────────────────

export type DrugCategory =
  | "ANTIBIOTIC"
  | "ANALGESIC"
  | "ANTIDIABETIC"
  | "CARDIOVASCULAR"
  | "VITAMIN"
  | "RESPIRATORY"
  | "GASTROINTESTINAL"
  | "DERMATOLOGY"
  | "NEUROLOGY"
  | "ONCOLOGY"
  | "OTHER";

export type DosageForm =
  | "TABLET"
  | "CAPSULE"
  | "SYRUP"
  | "INJECTION"
  | "CREAM"
  | "DROPS"
  | "INHALER"
  | "PATCH"
  | "SUPPOSITORY"
  | "OTHER";

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: DrugCategory;
  dosageForm: DosageForm;
  description: string;
  uses: string[];
  manufacturer: string | null;
  imageUrl: string | null;
  commonDosage: string | null;
  sideEffects: string[];
  contraindications: string[];
  storage: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface DrugFilters {
  search?: string;
  category?: string;
  dosageForm?: string;
  manufacturer?: string;
  sort?: "name_asc" | "name_desc" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DrugListResponse {
  data: Drug[];
  meta: PaginationMeta;
}
