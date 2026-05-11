"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Package,
  ShieldCheck,
  LineChart,
  Truck,
  Bot,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────
interface StatBar {
  label: string;
  value: number; // 0-100
}

interface Feature {
  id: string;
  icon: React.ElementType;
  color: string; // Tailwind text color  (must be full class)
  bgColor: string; // Tailwind bg/10 color (must be full class)
  barColor: string; // Tailwind bg color for the progress fill
  borderColor: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  stats: StatBar[];
}

// ─── Feature Data ─────────────────────────────────────────────────────────────
const features: Feature[] = [
  {
    id: "inventory",
    icon: Package,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    barColor: "bg-sky-500",
    borderColor: "border-sky-500/20",
    title: "Smart Inventory Matrix",
    tagline: "Zero stockouts. Zero waste.",
    description:
      "Automated tracking with real-time quantity monitoring, batch management, and instant expiry alerts. Know the status of every item in your pharmacy at a glance.",
    bullets: [
      "Track quantity, unit price, batch number, and expiry per item",
      "Low-stock alerts when quantity drops below reorder level",
      "Expiry alerts for items expiring within 30 days",
      "Bulk CSV import and PDF/CSV export",
      "AI forecast banner shows predicted stockouts",
    ],
    stats: [
      { label: "Stock accuracy", value: 99 },
      { label: "Waste reduction", value: 72 },
      { label: "Expiry detection", value: 95 },
      { label: "CSV import speed", value: 88 },
    ],
  },
  {
    id: "interaction-checker",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    barColor: "bg-emerald-500",
    borderColor: "border-emerald-500/20",
    title: "AI Drug Interaction Checker",
    tagline: "Catch dangerous combinations before they happen.",
    description:
      "Enter 2–5 drug names and get an instant, AI-powered interaction analysis. Color-coded risk levels (safe / moderate / dangerous) with clear clinical recommendations.",
    bullets: [
      "Powered by Google Gemini AI (gemini-1.5-flash)",
      "Analyzes 100,000+ drug interaction data points",
      "Per-pair severity rating with clinical explanation",
      "Full interaction history saved per pharmacy",
      "Structured JSON results for clinical audit trails",
    ],
    stats: [
      { label: "Interaction accuracy", value: 98 },
      { label: "Dangerous flags caught", value: 94 },
      { label: "Response speed", value: 87 },
      { label: "Clinical compliance", value: 100 },
    ],
  },
  {
    id: "demand-forecasting",
    icon: LineChart,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    barColor: "bg-blue-500",
    borderColor: "border-blue-500/20",
    title: "AI Demand Forecasting",
    tagline: "Order the right medicine, at the right time.",
    description:
      "Using the last 30 days of dispensing data, our AI predicts which drugs will stock out in the next 14 days and recommends exact reorder quantities — before it's too late.",
    bullets: [
      "Aggregates 30-day dispensing logs per pharmacy",
      "Urgency levels: Critical, High, Medium, Low",
      "Suggested order quantity per drug",
      "Results cached 6 hours to minimize API calls",
      "One-click 'Create Order' shortcut per forecast item",
    ],
    stats: [
      { label: "Stockout prevention", value: 91 },
      { label: "Forecast precision", value: 85 },
      { label: "14-day prediction rate", value: 78 },
      { label: "API cost savings", value: 60 },
    ],
  },
  {
    id: "supplier-orders",
    icon: Truck,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    barColor: "bg-amber-500",
    borderColor: "border-amber-500/20",
    title: "Supplier Order Management",
    tagline: "From purchase order to shelf — fully automated.",
    description:
      "Seamless B2B procurement flow. Create structured purchase orders, track status from pending to received, and automatically update your inventory upon arrival.",
    bullets: [
      "Order status flow: Pending → Shipped → Received → Cancelled",
      "Multi-step order creation with line items",
      "Auto-increments inventory on 'Mark as Received'",
      "AI suggests order quantities from demand forecast",
      "Full order history with supplier and amount tracking",
    ],
    stats: [
      { label: "Order fulfilment rate", value: 96 },
      { label: "Auto-inventory sync", value: 100 },
      { label: "Multi-supplier support", value: 82 },
      { label: "Procurement time saved", value: 74 },
    ],
  },
  {
    id: "ai-assistant",
    icon: Bot,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    barColor: "bg-purple-500",
    borderColor: "border-purple-500/20",
    title: "AI Pharmacist Assistant",
    tagline: "A clinical expert available 24/7.",
    description:
      "A full-page chat interface powered by Gemini AI. Ask any pharmacology question — dosage, drug substitutions, side effects — and get streaming, evidence-based answers instantly.",
    bullets: [
      "Streaming word-by-word AI responses",
      "Full conversation history saved per session",
      "Multi-session support with 'New Chat' button",
      "Copy message button on every AI response",
      "Context-aware follow-up question handling",
    ],
    stats: [
      { label: "Query accuracy", value: 93 },
      { label: "Response speed", value: 89 },
      { label: "Session retention", value: 76 },
      { label: "Pharmacist satisfaction", value: 97 },
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    barColor: "bg-rose-500",
    borderColor: "border-rose-500/20",
    title: "Analytics Dashboard",
    tagline: "See everything. Know everything.",
    description:
      "A comprehensive real-time dashboard for pharmacists and platform admins. Track dispensing trends, top medications, inventory health, and platform-wide activity.",
    bullets: [
      "Line chart: dispensing activity over last 7 days",
      "Pie chart: inventory breakdown by drug category",
      "Bar chart: top 5 most dispensed drugs this month",
      "Admin view: all pharmacies, users, and platform health",
      "AI-generated insight summary for admins",
    ],
    stats: [
      { label: "Dashboard load time", value: 95 },
      { label: "Data refresh rate", value: 88 },
      { label: "Chart accuracy", value: 99 },
      { label: "Admin coverage", value: 100 },
    ],
  },
];

// ─── Animated Progress Bar ────────────────────────────────────────────────────
function AnimatedBar({
  value,
  barColor,
  textColor,
  label,
  delay = 0,
  isVisible,
}: {
  value: number;
  barColor: string;
  textColor: string;
  label: string;
  delay?: number;
  isVisible: boolean;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [isVisible, value, delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-foreground truncate pr-2">
          {label}
        </span>
        <span className={`font-bold shrink-0 ${textColor}`}>
          {width > 0 ? value : 0}%
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// ─── Feature Card (visual side) ───────────────────────────────────────────────
function FeatureVisualCard({ feature }: { feature: Feature }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-3xl border ${feature.borderColor} bg-background p-6 md:p-8 shadow-xl relative overflow-hidden`}
    >
      {/* Ambient glow */}
      <div
        className={`absolute -top-10 -right-10 w-48 h-48 ${feature.bgColor} rounded-full blur-[60px] pointer-events-none`}
      />

      <div className="relative z-10 space-y-5">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${feature.bgColor} ${feature.color}`}
        >
          <feature.icon className="h-3.5 w-3.5" />
          {feature.title}
        </div>

        {/* Animated stat bars */}
        <div className="space-y-4">
          {feature.stats.map((stat, i) => (
            <AnimatedBar
              key={stat.label}
              label={stat.label}
              value={stat.value}
              barColor={feature.barColor}
              textColor={feature.color}
              delay={i * 150}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden bg-background">
        <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-16 lg:px-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            6 Core Platform Features
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 max-w-4xl mx-auto">
            Everything your pharmacy{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              needs to thrive
            </span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            MediFlow is built from the ground up for clinical precision —
            combining AI intelligence, real-time inventory control, and seamless
            B2B procurement in a single platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                Get Started Free
              </Button>
            </Link>
            <Link href="/drugs">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold border-primary/20 hover:bg-primary/5"
              >
                Explore Drug Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Detail Sections */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6 md:px-16 lg:px-24 space-y-20 md:space-y-32">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              id={feature.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center"
            >
              {/* Text Column — alternates side on lg */}
              <div
                className={`space-y-6 ${index % 2 !== 0 ? "lg:order-2" : "lg:order-1"}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.bgColor}`}
                >
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>

                <div>
                  <p
                    className={`text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 ${feature.color}`}
                  >
                    {feature.tagline}
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {feature.title}
                  </h2>
                </div>

                <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-sm text-foreground"
                    >
                      <CheckCircle2
                        className={`h-5 w-5 mt-0.5 shrink-0 ${feature.color}`}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Card Column */}
              <div
                className={`${index % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}
              >
                <FeatureVisualCard feature={feature} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 md:px-16 lg:px-24 text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to modernize your pharmacy?
          </h2>
          <p className="text-primary-foreground/80 text-base md:text-lg mb-8">
            Join 500+ pharmacies already using MediFlow to reduce stockouts,
            prevent drug interactions, and automate procurement.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-10 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Start for Free — No Credit Card Required
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
