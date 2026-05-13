"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { navItems } from "./nav-items";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            Medi<span className="text-primary">Flow</span>
          </span>
        </Link>
      </div>

      <div className="px-4 py-2">
        <p className="text-xs font-medium text-gray-500 px-2 py-2 uppercase tracking-wider">
          Pharmacist Portal
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-gray-600 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
