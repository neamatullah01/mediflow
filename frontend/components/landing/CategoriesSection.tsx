"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  ShieldPlus,
  Activity,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";

// Categories defined by your PRD
const categories = [
  {
    name: "Cardiovascular",
    count: "1,248 Items",
    icon: HeartPulse,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Antibiotics",
    count: "2,156 Items",
    icon: ShieldPlus,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Analgesics",
    count: "890 Items",
    icon: Activity,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    name: "Antidiabetics",
    count: "645 Items",
    icon: Droplets,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    name: "Vitamins",
    count: "1,432 Items",
    icon: Sun,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    name: "Respiratory",
    count: "430 Items",
    icon: Wind,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

export function CategoriesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 4x Duplication guarantees a practically infinite smooth loop
  const loopedCategories = [
    ...categories,
    ...categories,
    ...categories,
    ...categories,
  ];

  // Auto-play logic
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;

        // Updated Math: Card width + the new larger gap (gap-8 = 32px)
        const scrollAmount = window.innerWidth >= 768 ? 372 : 312;

        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - scrollAmount) {
          scrollContainerRef.current.scrollTo({
            left: scrollWidth / 2,
            behavior: "instant" as ScrollBehavior,
          });
          setTimeout(() => {
            scrollContainerRef.current?.scrollBy({
              left: scrollAmount,
              behavior: "smooth",
            });
          }, 50);
        } else {
          scrollContainerRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // Updated Math to account for the new padding
      const scrollAmount = window.innerWidth >= 768 ? 372 : 312;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const NavigationButtons = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-11 w-11 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted shadow-sm hover:shadow-md transition-all"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-11 w-11 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted shadow-sm hover:shadow-md transition-all"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-8 md:px-16 lg:px-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Specialized Inventories
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
              Access critical drug data across specialized categories.
            </p>
          </div>

          {/* Desktop Navigation */}
          <NavigationButtons className="hidden sm:flex" />
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="relative">
          {/* Edge masks adjusted to match new padding */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden md:block" />

          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            // THE FIX: Increased gap to gap-8, and added generous edge padding with px-8 md:px-12
            className="flex overflow-x-auto gap-8 pb-14 pt-4 px-8 md:px-12 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
              div::-webkit-scrollbar { display: none; }
            `,
              }}
            />

            {loopedCategories.map((category, index) => (
              <Card
                key={index}
                className="shrink-0 w-[280px] md:w-[340px] rounded-xl border-border/40 shadow-[0_0_25px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(14,165,233,0.15)] hover:border-primary/40 hover:-translate-y-2 cursor-pointer snap-start group bg-card"
              >
                <CardContent className="p-6 md:p-8 flex items-center gap-5">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 ${category.bg} group-hover:bg-primary/10 group-hover:scale-110`}
                  >
                    <category.icon
                      className={`h-7 w-7 ${category.color} group-hover:text-primary transition-colors`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {category.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
