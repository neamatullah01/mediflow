"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.login({
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        toast.error("Authentication Failed", {
          description: result.message || "Invalid credentials. Please try again.",
        });
        return;
      }

      toast.success("Authentication Successful", {
        description: result.message || "Welcome back to the MediFlow portal.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.";
      toast.error("Authentication Failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "pharmacist" | "admin") => {
    const demoEmail = role === "pharmacist" ? "pharmacist@mediflow.com" : "admin@mediflow.com";
    const demoPassword = role === "pharmacist" ? "Demo@1234" : "Admin@1234";

    setValue("email", demoEmail);
    setValue("password", demoPassword);

    toast.info("Demo Credentials Loaded", {
      description: `Authenticating as ${role}...`,
    });

    setIsLoading(true);
    try {
      const result = await authService.login({
        email: demoEmail,
        password: demoPassword,
      });

      if (!result.success) {
        toast.error("Demo Login Failed", {
          description: result.message || "Demo credentials not set up. Please register first.",
        });
        return;
      }

      toast.success("Demo Authentication Successful", {
        description: `Welcome, ${role === "admin" ? "Administrator" : "Pharmacist"}!`,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.";
      toast.error("Demo Login Failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Redirect to backend Google OAuth endpoint
      // Backend should handle: GET /api/v1/auth/google or similar
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/google`;
    } catch (error) {
      toast.error("Google Sign In Failed", {
        description: "Could not connect to Google. Please try again.",
      });
      setIsGoogleLoading(false);
    }
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="pharmacist@mediflow.com"
                className={`pr-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white ${
                  errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                {...register("email")}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
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
                placeholder="••••••••"
                className={`pr-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white ${
                  errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                {...register("password")}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0369a1] hover:bg-[#075985] text-white h-11 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="h-4 w-4" />
              </>
            )}
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
          type="button"
          variant="outline"
          disabled={isGoogleLoading}
          onClick={handleGoogleSignIn}
          className="w-full h-11 rounded-xl font-medium border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
        >
          {isGoogleLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Connecting...
            </span>
          ) : (
            <>
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
            </>
          )}
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
