import { getSession } from "@/services/session.service";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardRootLayout({
  children,
  admin,
  pharmacist,
}: Readonly<{
  children: React.ReactNode;
  admin: React.ReactNode;
  pharmacist: React.ReactNode;
}>) {
  // 1. Fetch user session
  const { data } = await getSession();
  const user = data?.user;
  const role = user?.role?.toUpperCase();

  // 2. Unauthenticated users get kicked to login
  if (!user) {
    redirect("/login");
  }

  // 3. Serve ONLY the Admin slot if they are an admin
  if (role === "ADMIN") {
    return <>{admin}</>;
  }

  // 4. Serve ONLY the Provider slot if they are a provider
  if (role === "PHARMACIST") {
    return <>{pharmacist}</>;
  }

  // 5. Normal customers shouldn't be here, send them to the homepage
  redirect("/");
}
