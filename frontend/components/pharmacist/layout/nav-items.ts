import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Truck,
  ShieldAlert,
  Bot,
  Settings,
  User,
} from "lucide-react";

export const navItems = [
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
