"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, LogOut, User, Menu, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "@/services/session.service";
import { authService } from "@/services/auth.service";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription, // 1. Added SheetDescription here
} from "@/components/ui/sheet";
import { navItems } from "./nav-items";
import { Button } from "@/components/ui/button";

export default function DashboardTopNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await getSession();
      if (data?.user) {
        setUser(data.user);
      }
    }
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "US";

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 z-50 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-white">
              <SheetHeader className="h-16 flex items-center px-6 border-b border-gray-100 flex-row">
                <SheetTitle className="text-left">
                  <Link
                    href="/"
                    className="flex items-center gap-2 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <Activity className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      Medi<span className="text-primary">Flow</span>
                    </span>
                  </Link>
                </SheetTitle>
                {/* 2. Added Visually Hidden Description here */}
                <SheetDescription className="sr-only">
                  Navigation menu for the pharmacist dashboard.
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 py-6 bg-white">
                <p className="text-xs font-semibold text-gray-400 px-2 uppercase tracking-wider mb-4">
                  Pharmacist Portal
                </p>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-gray-600 hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search medications, patients, or orders..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
          />
        </div>

        {/* Mobile Search Icon (only if input is hidden) */}
        <Button variant="ghost" size="icon" className="sm:hidden text-gray-600">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pr-1 sm:pr-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">
              {userInitials}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden lg:block">
              {user?.name || "Loading..."}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <Link
                href="/dashboard/profile"
                onClick={() => setIsProfileOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <User size={16} />
                My Profile
              </Link>
              <div className="h-px bg-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 text-left w-full transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
