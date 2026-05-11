"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Quote } from "lucide-react";

export function RegisterSideInfo() {
  return (
    <div className="hidden lg:flex flex-col justify-center h-full px-12 py-4 text-slate-900 dark:text-white">
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
            Elevate Your Pharmacy with <br />
            <span className="text-primary">Adaptive Intelligence.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-md leading-relaxed">
            Join thousands of clinical professionals using MediFlow to automate
            precision and ensure patient safety.
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                AI Interaction Checker
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Real-time cross-referencing of over 50,000 drug profiles.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                Predictive Inventory
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Forecast seasonal demands and optimize stock levels accurately.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonial Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="relative rounded-3xl overflow-hidden aspect-video bg-slate-200 mt-16"
      >
        <img
          src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80"
          alt="Clinical Pharmacist"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Quote className="h-8 w-8 text-primary mb-2 opacity-50" />
          <p className="text-white text-lg font-medium leading-relaxed italic">
            "MediFlow has reduced our dispensing errors by 34% in the first
            quarter."
          </p>
          <p className="text-primary font-bold mt-4 text-sm uppercase tracking-widest">
            — Dr. Sarah Chen, Clinical Lead
          </p>
        </div>
      </motion.div>
    </div>
  );
}
