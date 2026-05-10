"use client";

import {
  ScanLine,
  Activity,
  Bot,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

export function AIShowcaseSection() {
  return (
    <section className="py-20 md:py-32 bg-slate-950 text-slate-50 overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-72 h-72 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-emerald-500/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-16 lg:px-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Column: Copy & Features */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-widest">
                Adaptive Intelligence
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Clinical Interaction AI
              </h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
                Our LLM-powered interaction checker doesn&apos;t just read data;
                it understands context. It flags subtle contraindications that
                manual checks might miss.
              </p>
            </div>

            <div className="space-y-6 pt-2 md:pt-4">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="mt-1 bg-primary/20 p-2.5 rounded-xl h-fit shrink-0">
                  <ScanLine className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-slate-200">
                    Multimodal Data Parsing
                  </h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    Scans handwritten prescriptions and digital records
                    simultaneously to build a complete patient profile.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="mt-1 bg-primary/20 p-2.5 rounded-xl h-fit shrink-0">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-slate-200">
                    Dynamic Patient Profiling
                  </h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    Considers BMI, age, and chronic conditions dynamically
                    during every risk assessment calculation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating UI Mockups */}
          {/* THE FIX: Increased mobile height to 550px to allow vertical stacking, centered container */}
          <div className="relative h-[550px] sm:h-[500px] w-full max-w-[450px] mx-auto lg:max-w-none mt-8 lg:mt-0 perspective-1000">
            {/* Mockup Card 1: MediBot Assistant */}
            {/* THE FIX: w-[90%] on mobile, scales to w-[380px] on sm screens */}
            <div
              className="absolute top-0 left-0 w-[90%] sm:w-[380px] rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-4 md:p-5 z-20 animate-float"
              style={{ animationDuration: "6s" }}
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/50">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <h4 className="font-semibold text-sm md:text-base text-slate-200">
                  MediFlow Assistant
                </h4>
              </div>

              <div className="space-y-4">
                {/* User Message */}
                <div className="bg-slate-800 rounded-xl rounded-tr-sm p-3 text-xs md:text-sm text-slate-300 ml-6 md:ml-8 border border-slate-700/50">
                  Verify Lisinopril interaction with grapefruit juice.
                </div>

                {/* AI Response Message */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl rounded-tl-sm p-3 md:p-4 mr-2 md:mr-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-amber-500 mb-1">
                        Interaction Alert: Moderate
                      </p>
                      <p className="text-[10px] md:text-xs text-amber-200/70 leading-relaxed">
                        Furanocoumarins in grapefruit can inhibit CYP3A4,
                        potentially increasing serum concentration of the
                        medication.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup Card 2: Demand Prediction */}
            {/* THE FIX: Moved down vertically on mobile (top-[240px]) to prevent overlapping text, snaps to bottom-right on sm screens */}
            <div
              className="absolute top-[260px] sm:top-auto sm:bottom-0 right-0 w-[90%] sm:w-[340px] rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-4 md:p-5 z-30 animate-float"
              style={{ animationDuration: "7s", animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/50">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-sm md:text-base text-slate-200">
                  Demand Prediction
                </h4>
              </div>

              <div className="space-y-4 md:space-y-5">
                {/* Prediction Item 1 */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-2">
                    <span className="text-slate-300 font-medium">
                      Influenza Vaccine
                    </span>
                    <span className="text-emerald-400 text-[10px] md:text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      +45% next week
                    </span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[85%] rounded-full" />
                  </div>
                </div>

                {/* Prediction Item 2 */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-2">
                    <span className="text-slate-300 font-medium">
                      Allergy Relief
                    </span>
                    <span className="text-blue-400 text-[10px] md:text-xs font-bold bg-blue-400/10 px-2 py-0.5 rounded-full">
                      +20% tomorrow
                    </span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 w-[60%] rounded-full" />
                  </div>
                </div>

                {/* Risk Warning Item */}
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-rose-400 text-xs md:text-sm font-medium">
                    <ShieldAlert className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Amoxicillin stockout risk: High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `,
        }}
      />
    </section>
  );
}
