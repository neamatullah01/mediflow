"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";

export interface PricingTier {
  name: string;
  description: string;
  icon: any;
  monthlyPrice: number | string;
  annualPrice: number | string;
  features: string[];
  missingFeatures: string[];
  ctaText: string;
  popular: boolean;
}

export function PricingCard({
  tier,
  isAnnual,
  index,
}: {
  tier: PricingTier;
  isAnnual: boolean;
  index: number;
}) {
  const Icon = tier.icon;
  const isCustom = typeof tier.monthlyPrice === "string";

  // THE FIX: Sonner Toast implementation
  const handleAction = () => {
    toast.success(`${tier.name} Plan selected! Checkout integration pending.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="flex flex-col h-full"
    >
      {/* THE FIX: Forced bg-white and explicit borders to prevent dark-mode bleed in light mode */}
      <Card
        className={`flex flex-col h-full rounded-2xl relative transition-all duration-300 hover:shadow-2xl overflow-visible bg-white dark:bg-slate-900
        ${
          tier.popular
            ? "border-2 border-primary shadow-xl dark:shadow-primary/10 scale-100 md:scale-105 z-10"
            : "border border-slate-200 dark:border-slate-800 hover:-translate-y-2"
        }`}
      >
        {tier.popular && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-primary text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">
              Most Popular
            </span>
          </div>
        )}

        <CardHeader className="p-8 text-center pb-4 mt-2">
          <div
            className={`mx-auto p-4 rounded-2xl mb-5 w-fit ${tier.popular ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
          >
            <Icon className="h-7 w-7" />
          </div>
          {/* THE FIX: Enforced strict text colors */}
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
            {tier.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 h-10">
            {tier.description}
          </p>
        </CardHeader>

        <CardContent className="p-8 pt-0 flex-1">
          <div className="text-center mb-8 h-16 flex items-center justify-center">
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white">
              {!isCustom && "$"}
              {isAnnual ? tier.annualPrice : tier.monthlyPrice}
            </div>
            {!isCustom && (
              <span className="text-slate-500 dark:text-slate-400 font-medium ml-2 mt-4">
                /mo
              </span>
            )}
          </div>

          <ul className="space-y-4">
            {tier.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {tier.missingFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-slate-400 dark:text-slate-500"
              >
                <X className="h-5 w-5 shrink-0 opacity-40" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="p-8 pt-0 bg-transparent border-none">
          <Button
            onClick={handleAction}
            className={`w-full h-12 rounded-xl font-bold text-base transition-all ${
              tier.popular
                ? "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg"
                : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            }`}
          >
            {tier.ctaText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
