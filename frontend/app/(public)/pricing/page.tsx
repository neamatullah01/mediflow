import { PricingClient } from "@/components/pricing/PricingClient";

export const metadata = {
  title: "Pricing | MediFlow",
  description:
    "Simple, transparent pricing for modern pharmacies. Upgrade, downgrade, or cancel at any time.",
};

export default function PricingPage() {
  return <PricingClient />;
}
