import { cookies } from "next/headers";
import ProfileForm from "@/components/pharmacist/profile/ProfileForm";
import PasswordForm from "@/components/pharmacist/profile/PasswordForm";
import type { ProfileData } from "@/services/profile.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | MediFlow",
  description:
    "Manage your personal details, pharmacy information, and security settings.",
};

/** Server-side fetch — cookies are forwarded automatically, no token needed. */
async function fetchProfileData(): Promise<ProfileData> {
  try {
    const cookieStore = await cookies();
    const AUTH_URL =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:5000";

    const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`get-session returned ${res.status}`);

    const session = await res.json();
    const user = session?.user;

    if (!user) throw new Error("No user in session");

    return {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? user.pharmacy?.phone ?? "",
      pharmacyName: user.pharmacyName ?? user.pharmacy?.name ?? "",
      licenseNumber: user.licenseNumber ?? user.pharmacy?.licenseNumber ?? "",
      address: user.address ?? user.pharmacy?.address ?? "",
      avatarUrl: user.avatarUrl ?? null,
    };
  } catch (err) {
    console.warn("[ProfilePage] Could not load session, empty form will render:", err);
    return {
      name: "",
      email: "",
      phone: "",
      pharmacyName: "",
      licenseNumber: "",
      address: "",
      avatarUrl: null,
    };
  }
}

export default async function ProfilePage() {
  const initialData = await fetchProfileData();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal details, pharmacy information, and security
          settings.
        </p>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Info (2/3) */}
        <div className="lg:col-span-2">
          <ProfileForm initialData={initialData} />
        </div>

        {/* Right: Security / Password (1/3) */}
        <div className="lg:col-span-1">
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
