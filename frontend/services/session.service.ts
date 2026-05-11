"use server";

import { cookies } from "next/headers";

const AUTH_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL
  ? `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth`
  : "http://localhost:5000/api/auth";

export async function getSession() {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${AUTH_URL}/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    console.log(res);
    if (!res.ok) {
      return { data: null, error: { message: "Not authenticated" } };
    }

    const session = await res.json();
    return { data: session, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: "Backend unreachable or fetch failed",
      },
    };
  }
}
