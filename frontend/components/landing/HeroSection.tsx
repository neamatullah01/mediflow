"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// --- Custom Number Animation Component ---
const AnimatedNumber = ({
  end,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * end);

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };
    window.requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export function HeroSection() {
  // --- Enhanced Cinematic Image Slider ---
  const [currentImage, setCurrentImage] = useState(0);

  // Hand-picked images strictly focused on Pharmacy Medicine & Tracking
  const sliderImages = [
    // 1. Digital Tablet displaying medical data alongside medicine
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1200&auto=format&fit=crop",
    // 2. Clean, organized pharmacy/lab shelving
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1200",
    // 3. Close-up of medicine capsules representing the inventory
    "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=1200",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const handleNotImplemented = () => {
    toast.info("Interactive demo is coming soon!");
  };

  return (
    <section className="relative overflow-hidden bg-background pt-28 md:pt-32 lg:pt-40 pb-16">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-8 md:px-16 lg:px-24">
        {/* Main Hero Content */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 w-fit mb-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                </span>
                New: AI Demand Forecasting Live
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none leading-[1.1]">
                The Smart Pharmacy, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                  Powered by AI
                </span>
              </h1>
              <p className="max-w-[500px] text-muted-foreground text-sm md:text-base leading-relaxed">
                Modernizing pharmaceutical management with clinical precision.
                Optimize inventory, prevent interactions, and predict demand
                with our integrated AI ecosystem.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/register">
                <Button className="w-full sm:w-auto rounded-xl shadow-lg hover:shadow-xl transition-all h-11 px-8 font-semibold">
                  Get Started Today
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleNotImplemented}
                className="w-full sm:w-auto rounded-xl h-11 px-8 border-primary/20 hover:bg-primary/5 transition-colors group"
              >
                <PlayCircle className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
            </div>
          </div>

          {/* Right Image/Slider Column */}
          <div className="relative mx-auto w-full max-w-[450px] lg:max-w-none">
            {/* The Image Slider Container */}
            <div className="relative rounded-[2rem] border border-primary/10 shadow-2xl aspect-square lg:aspect-[4/3] overflow-hidden bg-muted group">
              {sliderImages.map((img, index) => (
                <img
                  key={img}
                  src={img}
                  alt={`Pharmacy Technology ${index + 1}`}
                  className={`absolute inset-0 object-cover w-full h-full transition-all duration-[2000ms] ease-in-out ${
                    index === currentImage
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-110"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none z-10" />

              {/* Slider Dots */}
              <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 hover:bg-white ${
                      index === currentImage
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Badge 1: Precision */}
            <div
              className="absolute -top-5 -left-5 md:-left-8 bg-background/95 backdrop-blur-sm border shadow-xl rounded-xl p-3 flex items-center gap-3 animate-bounce shadow-primary/10 z-30"
              style={{ animationDuration: "3.5s" }}
            >
              <div className="bg-primary/10 p-2 rounded-full">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold">99.9% Precision</p>
                <p className="text-[10px] text-muted-foreground">AI Verified</p>
              </div>
            </div>

            {/* Floating Badge 2: Alert */}
            <div
              className="absolute -bottom-5 -right-5 md:-right-8 bg-secondary/95 backdrop-blur-sm border border-secondary text-secondary-foreground shadow-xl rounded-xl p-3 flex items-center gap-3 animate-bounce shadow-secondary/20 z-30"
              style={{ animationDuration: "4.5s", animationDelay: "1s" }}
            >
              <div className="bg-white/20 p-2 rounded-full">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">At Stock Alert</p>
                <p className="text-[10px] text-white/80">Auto-Reorder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Stats Section */}
        <div className="mt-20 pt-10 border-t grid grid-cols-2 gap-6 md:grid-cols-4 divide-x divide-border/50 text-center relative z-10">
          <div className="space-y-1 transform hover:-translate-y-1 transition-transform cursor-default">
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary">
              <AnimatedNumber end={500} suffix="+" />
            </h3>
            <p className="text-[10px] md:text-xs tracking-wider text-muted-foreground uppercase font-bold">
              Pharmacies
            </p>
          </div>
          <div className="space-y-1 transform hover:-translate-y-1 transition-transform cursor-default">
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary">
              <AnimatedNumber end={12} suffix="M+" />
            </h3>
            <p className="text-[10px] md:text-xs tracking-wider text-muted-foreground uppercase font-bold">
              Prescriptions
            </p>
          </div>
          <div className="space-y-1 transform hover:-translate-y-1 transition-transform cursor-default">
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary">
              <AnimatedNumber end={4.9} decimals={1} suffix="/5" />
            </h3>
            <p className="text-[10px] md:text-xs tracking-wider text-muted-foreground uppercase font-bold">
              Client Rating
            </p>
          </div>
          <div className="space-y-1 transform hover:-translate-y-1 transition-transform cursor-default">
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary">
              <AnimatedNumber end={24} suffix="/7" />
            </h3>
            <p className="text-[10px] md:text-xs tracking-wider text-muted-foreground uppercase font-bold">
              AI Monitoring
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
