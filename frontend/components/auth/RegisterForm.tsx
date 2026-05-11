"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Call for Registering Pharmacy + Pharmacist User
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Pharmacy Registration Submitted Successfully!", {
        description: "We are setting up your secure workspace.",
      });
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-10 shadow-2xl"
    >
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Practitioner Registration
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Establish your secure pharmacy workspace in minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Name
            </Label>
            <Input
              placeholder="Dr. Jane Smith"
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pharmacy Name
            </Label>
            <Input
              placeholder="Central Health Pharma"
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              License Number
            </Label>
            <Input
              placeholder="PH-99281-XC"
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Phone Number
            </Label>
            <Input
              placeholder="+1 (555) 000-0000"
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Physical Address
            </Label>
            <Input
              placeholder="123 Medical Plaza, Suite 400"
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Email Address
            </Label>
            <Input
              type="email"
              placeholder="jane.smith@pharmacy.com"
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Confirm Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 py-2">
          <Checkbox
            id="terms"
            className="mt-1 border-slate-300 rounded"
            required
          />
          <Label
            htmlFor="terms"
            className="text-xs text-slate-500 leading-normal"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-primary font-semibold">
              Terms of Service
            </Link>{" "}
            and acknowledge the{" "}
            <Link href="/privacy" className="text-primary font-semibold">
              Privacy Policy
            </Link>{" "}
            regarding clinical data handling.
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#0369a1] hover:bg-[#075985] text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20"
        >
          {isLoading ? "Processing Workspace..." : "Complete Registration"}
        </Button>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline"
          >
            Login here
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
