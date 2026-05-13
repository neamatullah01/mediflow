export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: 'PHARMACIST' | 'ADMIN';
  pharmacyId: string | null;
  pharmacy?: PharmacyProfile;
}

export interface PharmacyProfile {
  id: string;
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  pharmacyName?: string;
  licenseNumber?: string;
  pharmacyPhone?: string;
  address?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}
