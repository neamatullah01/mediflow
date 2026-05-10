import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

// Content meticulously extracted from your mockup and PRD requirements
const testimonials = [
  {
    quote:
      "MediFlow has transformed our pharmacy. The interaction checker is remarkably fast and provides clinical nuances we haven't seen in other software.",
    name: "Dr. Elena Rossi",
    role: "Senior Pharmacist, CityHealth", // Added fictional pharmacy name per PRD
    rating: 5,
  },
  {
    quote:
      "The demand forecasting tool saved us from three major stockouts during the last flu season. It's like having a full-time data analyst.",
    name: "Marcus Chen",
    role: "Operations Manager, Westside Care",
    rating: 5,
  },
  {
    quote:
      "Simple to use, but extremely powerful under the hood. Our technicians were trained and productive within a single afternoon.",
    name: "Sarah Thompson",
    role: "Lead Technician, Oak Pharmacy",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-8 md:px-16 lg:px-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Trusted by Practitioners
          </h2>
          <p className="text-muted-foreground md:text-lg leading-relaxed">
            See how clinical teams are using MediFlow to modernize their daily
            operations and improve patient safety.
          </p>
        </div>

        {/* Testimonials Grid (3 columns as dictated by PRD and Mockup) */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              // Strict PRD compliance: rounded-xl, standard border, matching the mockup's clean aesthetic
              className="rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Massive subtle quote icon in the background for styling */}
              <Quote className="absolute -top-4 -left-4 h-24 w-24 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors pointer-events-none" />

              <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between space-y-6">
                <div className="space-y-4">
                  {/* PRD Requirement: Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* The Quote */}
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-border/50">
                  <p className="font-semibold text-foreground">
                    — {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
