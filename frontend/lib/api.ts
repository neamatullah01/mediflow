import axios from "axios";

// Create a configured Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Allows cookies to be sent cross-origin for Better Auth session management
  withCredentials: true,
});

// Optional: Add global response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global 401 Unauthorized redirects here later

    // We intentionally omit console.error here so Next.js doesn't
    // hijack the screen with its development error overlay.
    // The error is simply passed down to be caught by your UI components.

    return Promise.reject(error);
  },
);
