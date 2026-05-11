import { Activity, ShieldCheck, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

// 1. Maintain SEO with Server-Side Metadata
export const metadata = {
  title: "Secure Login | MediFlow Clinical Portal",
  description:
    "Authenticate into the MediFlow clinical precision and adaptive intelligence dashboard.",
};

export default function LoginPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-poppins selection:bg-primary/20">
      {/* Top Header / Logo */}
      <header className="w-full pt-12 pb-6 flex flex-col items-center justify-center">
        <Link href="/" className="flex flex-col items-center gap-3 group">
          <div className="bg-primary p-3 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Medi<span className="text-primary">Flow</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Clinical Precision & Adaptive Intelligence
            </p>
          </div>
        </Link>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full">
        {/* Render the Client Component */}
        <LoginForm />

        {/* Trust & Compliance Badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LockKeyhole className="h-4 w-4" />
            <span>256-Bit AES</span>
          </div>
        </div>
      </main>

      {/* Minimal Auth Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/60 mt-12 py-8 bg-white dark:bg-slate-950/50">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Medi<span className="text-primary">Flow</span>
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {currentYear} MediFlow. Clinical Precision & Adaptive
              Intelligence.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/careers"
              className="hover:text-primary transition-colors"
            >
              Careers
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
