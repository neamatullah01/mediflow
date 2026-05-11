"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Zap, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PricingCard, PricingTier } from "./PricingCard";
import { toast } from "sonner";

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description:
      "Perfect for small, independent pharmacies starting their digital transformation.",
    icon: Building2,
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      "Up to 1,000 Inventory Items",
      "Basic Dispensing Logs",
      "Standard Supplier Orders",
      "Email Support",
    ],
    missingFeatures: [
      "AI Drug Interaction Checks",
      "Demand Prediction Forecasting",
      "HL7 EMR Integration",
    ],
    ctaText: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description:
      "Advanced AI features for high-volume clinics focused on patient safety.",
    icon: Zap,
    monthlyPrice: 149,
    annualPrice: 119,
    features: [
      "Unlimited Inventory Items",
      "AI Drug Interaction Checker",
      "Demand Prediction Analytics",
      "Priority 24/7 Support",
    ],
    missingFeatures: ["HL7 EMR Integration"],
    ctaText: "Get Professional",
    popular: true,
  },
  {
    name: "Enterprise",
    description:
      "Custom architecture and compliance integration for hospital networks.",
    icon: Shield,
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    features: [
      "Everything in Professional",
      "HL7 & FHIR EMR Integration",
      "Custom Data Residency",
      "Dedicated Account Manager",
    ],
    missingFeatures: [],
    ctaText: "Contact Sales",
    popular: false,
  },
];

export function PricingClient() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Ambient Background Glows matching HeroSection */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <section className="pt-28 pb-32 border-b border-border/40 relative z-10 bg-background/50 backdrop-blur-3xl">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground"
          >
            Simple, Transparent <span className="text-primary">Pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Choose the perfect plan for your clinical needs. Upgrade or cancel
            at any time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center gap-4 p-2 px-6 rounded-full bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 shadow-sm backdrop-blur-md"
          >
            <span
              className={`text-sm font-semibold ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span
              className={`text-sm font-semibold ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Annually{" "}
              <span className="text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs ml-1 px-2 py-0.5 rounded-full">
                -20%
              </span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Cards perfectly overlap the solid section */}
      <section className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto lg:items-center">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              isAnnual={isAnnual}
              index={index}
            />
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 mt-24 max-w-3xl text-center"
      >
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Are you a multi-location hospital network?
        </h3>
        <p className="text-muted-foreground mb-8">
          We offer volume discounts, custom SLAs, and dedicated technical
          integration teams.
        </p>
        <Button
          variant="outline"
          className="h-12 px-8 rounded-xl font-semibold bg-background hover:bg-muted text-foreground"
          onClick={() =>
            toast("Our enterprise sales team will reach out to you shortly.", {
              icon: "🏢",
            })
          }
        >
          Contact Enterprise Sales
        </Button>
      </motion.section>
    </div>
  );
}
