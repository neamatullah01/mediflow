import axios from "axios";

// Create a configured Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
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
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  },
);
