"use client";

import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Pharmacology",
  "Technology",
  "Logistics",
  "Industry",
];

export function CategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={active === cat ? "default" : "outline"}
          onClick={() => onChange(cat)}
          className="rounded-full px-6 transition-all"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
