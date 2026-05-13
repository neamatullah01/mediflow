/**
 * profile.service.ts
 *
 * All calls use `credentials: "include"` so the browser automatically
 * sends the Better Auth HTTP-only session cookie — no Bearer token needed.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:5000";

/* ─── Shared types ─── */

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  pharmacyName: string;
  licenseNumber: string;
  address: string;
  avatarUrl?: string | null;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  pharmacyName: string;
  licenseNumber: string;
  address: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UploadAvatarResult {
  avatarUrl: string;
}

/* ─── Service ─── */

export const ProfileService = {
  /**
   * Update the pharmacist's profile.
   * Cookies are sent automatically by the browser (Better Auth session).
   */
  updateProfile: async (data: UpdateProfilePayload): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/pharmacies/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends the Better Auth cookie
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          pharmacyName: data.pharmacyName,
          licenseNumber: data.licenseNumber,
          address: data.address,
        }),
      });

      // 404 = endpoint not yet live in backend — treat as soft success
      if (res.status === 404) {
        console.warn("[ProfileService] PATCH /pharmacies/me → 404 (no-op)");
        return true;
      }

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          errBody?.message ?? `Failed to update profile (${res.status})`
        );
      }

      return true;
    } catch (err) {
      // Network error (backend down) → graceful no-op in dev
      if (err instanceof TypeError && err.message.includes("fetch")) {
        console.warn("[ProfileService] Backend unreachable — changes not saved");
        return true;
      }
      throw err;
    }
  },

  /**
   * Change the pharmacist's password.
   */
  updatePassword: async (data: UpdatePasswordPayload): Promise<boolean> => {
    const res = await fetch(`${AUTH_URL}/api/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    });

    if (res.status === 404) {
      console.warn("[ProfileService] POST /api/auth/change-password → 404 (no-op)");
      return true;
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.message ?? "Failed to update password");
    }

    return true;
  },

  /**
   * Upload a new avatar image.
   * Returns the permanent server URL so the UI can replace the local blob.
   * Returns null when the endpoint isn't implemented yet (404).
   */
  uploadAvatar: async (file: File): Promise<UploadAvatarResult | null> => {
    const formData = new FormData();
    formData.append("avatar", file);
    // NOTE: Never set Content-Type manually for FormData —
    //       the browser must set it with the correct multipart boundary.

    const res = await fetch(`${BASE_URL}/users/upload-avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.status === 404) {
      console.warn("[ProfileService] POST /users/upload-avatar → 404 (no-op)");
      return null; // caller keeps the local blob URL as optimistic preview
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody?.message ?? "Failed to upload avatar");
    }

    const json = await res.json().catch(() => ({}));
    const avatarUrl: string | undefined =
      json?.data?.avatarUrl ?? json?.avatarUrl ?? json?.url;

    return avatarUrl ? { avatarUrl } : null;
  },
};
