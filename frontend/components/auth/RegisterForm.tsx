"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { authService } from "@/services/auth.service";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  pharmacyName: z.string().min(2, "Pharmacy name must be at least 2 characters"),
  licenseNumber: z.string().min(3, "License number is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const termsAccepted = watch("termsAccepted");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        pharmacyName: data.pharmacyName,
        licenseNumber: data.licenseNumber,
        phone: data.phone,
        address: data.address,
      });

      if (!result.success) {
        toast.error("Registration Failed", {
          description: result.message || "Could not create account. Please try again.",
        });
        return;
      }

      toast.success("Registration Successful!", {
        description: result.message || "Your pharmacy workspace is being set up. Welcome to MediFlow!",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.";
      toast.error("Registration Failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Dr. Jane Smith"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pharmacyName" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pharmacy Name
            </Label>
            <Input
              id="pharmacyName"
              placeholder="Central Health Pharma"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                errors.pharmacyName ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("pharmacyName")}
            />
            {errors.pharmacyName && (
              <p className="text-xs text-red-500">{errors.pharmacyName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              License Number
            </Label>
            <Input
              id="licenseNumber"
              placeholder="PH-99281-XC"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                errors.licenseNumber ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("licenseNumber")}
            />
            {errors.licenseNumber && (
              <p className="text-xs text-red-500">{errors.licenseNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 000-0000"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Physical Address
            </Label>
            <Input
              id="address"
              placeholder="123 Medical Plaza, Suite 400"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                errors.address ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jane.smith@pharmacy.com"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ${
                errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 py-2">
          <Checkbox
            id="terms"
            className={`mt-1 border-slate-300 rounded ${
              errors.termsAccepted ? "border-red-500 data-[state=checked]:bg-red-500" : ""
            }`}
            checked={termsAccepted}
            onCheckedChange={(checked) => setValue("termsAccepted", checked as boolean, { shouldValidate: true })}
          />
          <Label
            htmlFor="terms"
            className={`text-xs leading-normal ${
              errors.termsAccepted ? "text-red-500" : "text-slate-500"
            }`}
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
        {errors.termsAccepted && (
          <p className="text-xs text-red-500 -mt-4">{errors.termsAccepted.message}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#0369a1] hover:bg-[#075985] text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Workspace...
            </>
          ) : (
            "Complete Registration"
          )}
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
