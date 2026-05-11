"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Better Auth login delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Authentication Successful", {
        description: "Welcome back to the MediFlow portal.",
      });
    }, 1000);
  };

  const handleDemoLogin = (role: "pharmacist" | "admin") => {
    const demoEmail =
      role === "pharmacist" ? "pharmacist@mediflow.com" : "admin@mediflow.com";
    setEmail(demoEmail);
    setPassword("Demo@1234");
    toast.info("Demo Credentials Loaded", {
      description: `Ready to authenticate as ${role}.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your pharmacy portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Professional Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pharmacist@mediflow.com"
                className="pr-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                required
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Security Key
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                required
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0369a1] hover:bg-[#075985] text-white h-11 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? "Authenticating..." : "Login"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-950 px-3 text-slate-500 font-semibold tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Button */}
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl font-medium border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>

        {/* AI Access Simulator (Demo Fast-Login) */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              AI Access Simulator
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin("pharmacist")}
              className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-primary/50 transition-colors group"
            >
              <div className="text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
                Demo Pharmacist
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                pharmacist@mediflow.com
              </div>
            </button>
            <button
              onClick={() => handleDemoLogin("admin")}
              className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-emerald-500/50 transition-colors group"
            >
              <div className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-500 transition-colors">
                Demo Admin
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                admin@mediflow.com
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          New to MediFlow?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
