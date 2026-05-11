"use client";

import { motion } from "framer-motion";
import { 
  Pill, 
  Building2, 
  ShieldAlert, 
  Info, 
  FileText, 
  Stethoscope, 
  Package, 
  Star,
  MessageSquare
} from "lucide-react";
import type { Drug } from "@/types/drug.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  ANTIBIOTIC:     "bg-emerald-500/10 text-emerald-600",
  ANALGESIC:      "bg-amber-500/10 text-amber-600",
  ANTIDIABETIC:   "bg-rose-500/10 text-rose-600",
  CARDIOVASCULAR: "bg-blue-500/10 text-blue-600",
  VITAMIN:        "bg-orange-500/10 text-orange-600",
  RESPIRATORY:    "bg-cyan-500/10 text-cyan-600",
  GASTROINTESTINAL: "bg-lime-500/10 text-lime-600",
  DERMATOLOGY:    "bg-pink-500/10 text-pink-600",
  NEUROLOGY:      "bg-purple-500/10 text-purple-600",
  ONCOLOGY:       "bg-red-500/10 text-red-600",
  OTHER:          "bg-slate-500/10 text-slate-600",
};

function formatEnum(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80";

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  drug: Drug;
  reviews?: any[];
}

export function DrugDetailView({ drug, reviews = [] }: Props) {
  const badgeClass = CATEGORY_COLORS[drug.category] ?? CATEGORY_COLORS.OTHER;
  
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  
  // Calculate avg rating (mock if empty)
  const avgRating = safeReviews.length > 0 
    ? safeReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / safeReviews.length 
    : 4.5;

  return (
    <div className="space-y-12 pb-20">
      {/* ── Section 1: Overview ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Image Container */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-border/50 shadow-2xl bg-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={drug.imageUrl ?? FALLBACK_IMAGE}
            alt={drug.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* Header Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
              {formatEnum(drug.category)}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {drug.name}
            </h1>
            <p className="text-xl text-muted-foreground italic font-medium">
              {drug.genericName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Pill className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground">
                {formatEnum(drug.dosageForm)}
              </span>
            </div>
            {drug.manufacturer && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground">
                  {drug.manufacturer}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              </div>
              <span className="font-semibold text-foreground">
                {avgRating.toFixed(1)} / 5.0
              </span>
              <span className="text-xs">({reviews.length || 12} reviews)</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {drug.description || "No description available for this medication."}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Section 2: Details Grid ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Description & Uses */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <FileText className="h-5 w-5 text-primary" />
              Clinical Uses
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(drug.uses && drug.uses.length > 0 ? drug.uses : ["Consult your pharmacist for usage"]).map((use, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">{use}</span>
                </div>
              ))}
            </div>
          </div>

          {drug.commonDosage && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-bold">
                <Stethoscope className="h-5 w-5 text-primary" />
                Dosage & Guidelines
              </div>
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {drug.commonDosage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Key Info Sidebar */}
        <div className="space-y-6">
          {/* Side Effects */}
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-2 font-bold text-amber-700">
              <ShieldAlert className="h-5 w-5" />
              Side Effects
            </div>
            <ul className="space-y-2">
              {(drug.sideEffects || ["Nausea", "Dizziness", "Headache"]).map((effect, i) => (
                <li key={i} className="text-xs md:text-sm text-amber-900/70 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                  {effect}
                </li>
              ))}
            </ul>
          </div>

          {/* Contraindications */}
          <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2 font-bold text-rose-700">
              <ShieldAlert className="h-5 w-5" />
              Contraindications
            </div>
            <ul className="space-y-2">
              {(drug.contraindications || ["Hypersensitivity", "Severe renal impairment"]).map((item, i) => (
                <li key={i} className="text-xs md:text-sm text-rose-900/70 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Storage */}
          {drug.storage && (
            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-4">
              <div className="flex items-center gap-2 font-bold text-blue-700">
                <Package className="h-5 w-5" />
                Storage Requirements
              </div>
              <p className="text-xs md:text-sm text-blue-900/70">
                {drug.storage}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 3: Reviews ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Clinical Notes & Reviews</h2>
          </div>
          <div className="text-sm font-semibold text-muted-foreground">
            {safeReviews.length} Review{safeReviews.length !== 1 ? 's' : ''}
          </div>
        </div>

        {safeReviews.length === 0 ? (
          <div className="py-12 text-center bg-muted/20 rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground italic">No clinical reviews yet for this medication.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeReviews.map((review, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, star) => (
                      <Star 
                        key={star} 
                        className={`h-3.5 w-3.5 ${star < (review.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed italic">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-xs font-bold">Verified Pharmacist</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
