import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supplier Orders | MediFlow Pharmacist",
  description: "Track your purchase history and restock inventory from global suppliers. Manage pending and received orders.",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
