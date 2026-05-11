import { Request } from "express";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import type {
  RegisterPharmacistPayload,
  LoginPayload,
} from "./auth.validation";

export const registerPharmacistIntoDB = async (
  payload: RegisterPharmacistPayload,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const existingPharmacy = await prisma.pharmacy.findUnique({
    where: { licenseNumber: payload.licenseNumber },
  });
  if (existingPharmacy) {
    throw new AppError("License number already registered", 409);
  }

  const response = await (auth.api.signUpEmail as any)({
    body: {
      name: payload.fullName,
      email: payload.email,
      password: payload.password,
    },
    asResponse: true,
  });

  let result: any;
  let setCookieHeader: string | string[] | null = null;

  if (response && typeof response.json === "function") {
    const headers = response.headers;
    if (typeof headers.getSetCookie === "function") {
      const cookies = headers.getSetCookie();
      setCookieHeader = cookies.length === 1 ? cookies[0] : cookies;
    } else {
      const raw = headers.get("set-cookie");
      if (raw) setCookieHeader = raw;
    }
    result = await response.json();
  } else {
    result = response;
  }

  if (!result || !result.user) {
    throw new AppError("Registration failed", 500);
  }

  const { pharmacy, updatedUser } = await prisma.$transaction(async (tx) => {
    const pharmacy = await tx.pharmacy.create({
      data: {
        name: payload.pharmacyName,
        licenseNumber: payload.licenseNumber,
        address: payload.address,
        phone: payload.phone,
      },
    });

    const updatedUser = await tx.user.update({
      where: { id: result.user.id },
      data: { pharmacyId: pharmacy.id },
    });

    return { pharmacy, updatedUser };
  });

  return {
    user: updatedUser,
    pharmacy,
    token: result.token || null,
    setCookieHeader,
  };
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await (auth.api.signInEmail as any)({
    body: {
      email: payload.email,
      password: payload.password,
    },
    asResponse: true,
  });

  let result: any;
  let setCookieHeader: string | string[] | null = null;

  if (response && typeof response.json === "function") {
    const headers = response.headers;
    if (typeof headers.getSetCookie === "function") {
      const cookies = headers.getSetCookie();
      setCookieHeader = cookies.length === 1 ? cookies[0] : cookies;
    } else {
      const raw = headers.get("set-cookie");
      if (raw) setCookieHeader = raw;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(errorData?.message || "Invalid credentials", 401);
    }

    result = await response.json();
  } else {
    result = response;
    if (!result || !result.user) {
      throw new AppError("Invalid credentials", 401);
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: result.user.id },
    include: { pharmacy: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    user,
    session: result.session || null,
    setCookieHeader,
  };
};

export const logoutUser = async (req: Request) => {
  const response = await auth.api.signOut({
    headers: req.headers as any,
    asResponse: true,
  });

  let setCookieHeader: string | string[] | null = null;

  if (response && typeof response.headers !== "undefined") {
    const headers = response.headers as any;
    if (typeof headers.getSetCookie === "function") {
      const cookies = headers.getSetCookie();
      setCookieHeader = cookies.length === 1 ? cookies[0] : cookies;
    } else if (typeof headers.get === "function") {
      const raw = headers.get("set-cookie");
      if (raw) setCookieHeader = raw;
    }
  }

  return { setCookieHeader };
};

export const refreshSession = async (req: Request) => {
  const response = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!response || !response.session) {
    throw new AppError("No active session to refresh", 401);
  }

  return {
    user: response.user,
    session: response.session,
  };
};
