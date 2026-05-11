import { Activity, ShieldCheck, LockKeyhole, Search } from "lucide-react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterSideInfo } from "@/components/auth/RegisterSideInfo";

export const metadata = {
  title: "Register | Establish Your Pharmacy on MediFlow",
  description:
    "Join MediFlow to automate inventory, ensure patient safety with AI interaction checks, and optimize logistics.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-poppins">
      {/* Header Logo (Mobile Only) */}
      <div className="lg:hidden w-full pt-4 flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            Medi<span className="text-primary">Flow</span>
          </span>
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-6 pb-12 lg:pb-20 pt-4 lg:pt-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Marketing (Hidden on Mobile) */}
        <RegisterSideInfo />

        {/* Right Side: Form */}
        <div className="flex justify-center">
          <RegisterForm />
        </div>
      </main>

      {/* Trust Badges Bar */}
      <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-6">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> HIPAA Compliant
          </div>
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4" /> 256-Bit Encryption
          </div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" /> FDA Data Synced
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-slate-900 dark:text-white italic">
              Medi<span className="text-primary">Flow</span>
            </span>
            <span className="text-xs text-slate-500 font-medium border-l border-slate-200 pl-4 h-5 flex items-center">
              Clinical Precision & Adaptive Intelligence
            </span>
          </div>
          <div className="flex gap-6 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/careers">Careers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
