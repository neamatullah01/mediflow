"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Truck,
  ShieldAlert,
  Bot,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Dispensing", href: "/dashboard/dispensing", icon: ClipboardList },
  { name: "Orders", href: "/dashboard/orders", icon: Truck },
  {
    name: "Interaction Checker",
    href: "/dashboard/interactions",
    icon: ShieldAlert,
  },
  { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-sky-500 flex items-center gap-2">
          <span className="bg-sky-500 text-white p-1 rounded-md">
            <Package size={20} />
          </span>
          MediFlow
        </h1>
      </div>

      <div className="px-4 py-2">
        <p className="text-xs font-medium text-gray-500 px-2 py-2">
          Pharmacist Portal
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-sky-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
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
