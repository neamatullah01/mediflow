import DashboardSidebar from "@/components/pharmacist/layout/DashboardSidebar";
import DashboardTopNav from "@/components/pharmacist/layout/DashboardTopNav";

export default function PharmacistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardTopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
