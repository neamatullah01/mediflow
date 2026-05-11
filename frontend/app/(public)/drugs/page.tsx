import type { Metadata } from "next";
import { Microscope } from "lucide-react";
import { DrugSearchView } from "@/components/drugs/DrugSearchView";

export const metadata: Metadata = {
  title: "Drug Search | MediFlow — Explore the Medicine Catalogue",
  description:
    "Search and explore thousands of drugs. Filter by category, dosage form, and manufacturer. Powered by MediFlow's AI-driven pharmaceutical platform.",
};

export default function DrugsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="relative bg-muted/30 border-b border-border/40 pt-28 md:pt-32 pb-10 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-16 lg:px-24 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Microscope className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Public Drug Catalogue
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Drug Search & Explore
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            Browse our comprehensive master drug catalogue. Search by name or
            generic name, filter by category, dosage form, and manufacturer —
            all in real time.
          </p>
        </div>
      </div>

      {/* Main Search UI */}
      <div className="container mx-auto px-6 md:px-16 lg:px-24 py-10 md:py-14">
        <DrugSearchView />
      </div>
    </div>
  );
}
