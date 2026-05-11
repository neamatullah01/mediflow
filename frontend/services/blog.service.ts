import { api } from "@/lib/api";

// Define the response type based on your PRD schema
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string | null;
  readTime: number;
}

export const BlogService = {
  /**
   * Fetches the latest published blog posts.
   * Note: We use the native fetch API here instead of Axios because Next.js App Router
   * highly optimizes `fetch` for Server Components (caching, revalidation).
   */
  getLatestPosts: async (limit: number = 3): Promise<BlogPost[]> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/blog?limit=${limit}&sort=desc`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!res.ok) throw new Error("Failed to fetch posts");

      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("BlogService.getLatestPosts Error:", error);
      return []; // Return empty array on failure to prevent page crashes
    }
  },
  getAllPosts: async (category?: string): Promise<BlogPost[]> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const url =
        category && category !== "All"
          ? `${baseUrl}/blog?category=${category}`
          : `${baseUrl}/blog`;

      const res = await fetch(url, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch blog");
      const json = await res.json();
      return json.data || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};
