import { Metadata } from "next";
import { cookies } from "next/headers";
import InventoryClientView from "@/components/pharmacist/inventory/InventoryClientView";
import type { InventoryResponse } from "@/types/inventory.types";

// ─── SEO metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Inventory Management | MediFlow",
  description:
    "Monitor and manage your pharmacy's medicine stock levels, expiry dates, batch numbers, and supplier information in real time.",
  robots: { index: false, follow: false }, // Dashboard pages are private
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const FALLBACK: InventoryResponse = {
  data: [],
  meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
};

// ─── Server-side initial data fetch ──────────────────────────────────────────
async function fetchInitialInventory(): Promise<InventoryResponse> {
  try {
    const cookieStore = await cookies();
    const res = await fetch(
      `${BASE_URL}/inventory?page=1&limit=20&sortBy=createdAt&sortOrder=desc`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return FALLBACK;

    const json = await res.json();

    // Normalize all possible backend response shapes:
    //  Shape A: { data: InventoryItem[], meta: {} }          → already correct
    //  Shape B: { data: { data: InventoryItem[], meta: {} } } → unwrap json.data
    //  Shape C: { success: true, data: InventoryItem[], meta: {} } → top-level meta
    const candidate = json?.data?.data !== undefined ? json.data : json;

    if (Array.isArray(candidate?.data)) {
      return {
        data: candidate.data,
        meta: candidate.meta ?? FALLBACK.meta,
      };
    }

    // If data itself is an array (flat response)
    if (Array.isArray(candidate)) {
      return { data: candidate, meta: FALLBACK.meta };
    }

    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function InventoryManagementPage() {
  const initialData = await fetchInitialInventory();

  return <InventoryClientView initialData={initialData} />;
}
