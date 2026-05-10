import { api } from "@/lib/api";

export const NewsletterService = {
  /**
   * Subscribes an email to the newsletter.
   * Since this is a mutation (POST) triggered by a user action on the client,
   * Axios is perfect here.
   */
  subscribe: async (email: string) => {
    try {
      // POST /api/v1/newsletter/subscribe
      const response = await api.post("/newsletter/subscribe", { email });
      return response.data;
    } catch (error: any) {
      // Extract the backend error message if available
      throw new Error(
        error.response?.data?.message || "Failed to subscribe to newsletter",
      );
    }
  },
};
