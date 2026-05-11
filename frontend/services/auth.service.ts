import { api } from "@/lib/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  pharmacyName: string;
  licenseNumber: string;
  phone: string;
  address: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      pharmacyId?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  };
}

export const authService = {
  /**
   * Login with email and password
   * POST /api/v1/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  /**
   * Register a new pharmacist with pharmacy
   * POST /api/v1/auth/register
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Logout the current user
   * POST /api/v1/auth/logout (requires auth)
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      "/auth/logout",
    );
    return response.data;
  },

  /**
   * Refresh the access token
   * POST /api/v1/auth/refresh-token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/refresh-token");
    return response.data;
  },
};
