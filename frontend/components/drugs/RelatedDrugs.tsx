"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { DrugService } from "@/services/drug.service";
import type { Drug } from "@/types/drug.types";
import { DrugCard } from "./DrugCard";
import { DrugCardSkeleton } from "./DrugCardSkeleton";

interface Props {
  category: string;
  currentDrugId: string;
}

export function RelatedDrugs({ category, currentDrugId }: Props) {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await DrugService.getDrugs({
          category,
          limit: 5, // Fetch 5 to ensure we have 4 excluding current
        });
        // Filter out current drug and take top 4
        const data = Array.isArray(res.data) ? res.data : [];
        const filtered = data
          .filter((d) => d.id !== currentDrugId)
          .slice(0, 4);
        setDrugs(filtered);
      } catch (err) {
        console.error("Failed to fetch related drugs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRelated();
  }, [category, currentDrugId]);

  if (!loading && drugs.length === 0) return null;

  return (
    <section className="space-y-8 pt-10 border-t border-border/40">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Related Medications</h2>
        <div className="flex items-center gap-1 text-sm font-semibold text-primary">
          Explore Category
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <DrugCardSkeleton key={i} />)
          : drugs.map((drug, i) => <DrugCard key={drug.id} drug={drug} index={i} />)}
      </div>
    </section>
  );
}
