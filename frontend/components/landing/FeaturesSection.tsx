import {
  LineChart,
  ShieldCheck,
  Package,
  Bot,
  Truck,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Predictive Demand Forecast",
    description:
      "Using adaptive AI, MediFlow predicts medication demand based on local health trends and historical data, reducing stockouts by 45%.",
    icon: LineChart,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Interaction Checker",
    description:
      "Real-time cross-referencing of 100k+ drug interaction data points to ensure patient safety and flag subtle contraindications.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Inventory Matrix",
    description:
      "Automated tracking with smart monitoring, batch management, and instant expiry alerts to eliminate pharmaceutical waste.",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Supplier Orders",
    description:
      "Seamless B2B procurement flow. Track order statuses from pending to received, automatically updating your inventory upon arrival.",
    icon: Truck,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "AI Assistant",
    description:
      "Voice and text-activated queries for rapid pharmacology referencing, dosage guidance, and substitution recommendations.",
    icon: Bot,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Comprehensive platform-wide insights. Track dispensing activity, top medications, and overall pharmacy health in real-time.",
    icon: BarChart3,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-8 md:px-16 lg:px-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Engineered for Accuracy
          </h2>
          <p className="text-muted-foreground md:text-lg leading-relaxed">
            Our features are designed to minimize human error and maximize
            operational efficiency in clinical settings.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-xl border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-card group"
            >
              <CardHeader className="pb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${feature.bgColor} group-hover:bg-primary/10`}
                >
                  <feature.icon
                    className={`h-6 w-6 ${feature.color} group-hover:text-primary transition-colors`}
                  />
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
