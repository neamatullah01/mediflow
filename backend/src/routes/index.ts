import { Router } from "express";
import { authRoutes } from "../modules/Auth/auth.route";
import { userRoutes } from "../modules/User/user.route";
import { pharmacyRoutes } from "../modules/Pharmacy/pharmacy.route";
import { drugRoutes } from "../modules/Drug/drug.route";
import { inventoryRoutes } from "../modules/Inventory/inventory.route";
import { dispensingRoutes } from "../modules/Dispensing/dispensing.route";
import { orderRoutes } from "../modules/Order/order.route";
import { reviewRoutes } from "../modules/Review/review.route";
import { aiRoutes } from "../modules/AI/ai.route";
import { blogRoutes } from "../modules/Blog/blog.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { miscRoutes } from "../modules/Misc/misc.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/pharmacies", route: pharmacyRoutes },
  { path: "/drugs", route: drugRoutes },
  { path: "/inventory", route: inventoryRoutes },
  { path: "/dispensing", route: dispensingRoutes },
  { path: "/orders", route: orderRoutes },
  { path: "/reviews", route: reviewRoutes },
  { path: "/ai", route: aiRoutes },
  { path: "/blog", route: blogRoutes },
  { path: "/admin", route: adminRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// Misc routes are mounted directly under /api/v1
router.use("/", miscRoutes);

export default router;
