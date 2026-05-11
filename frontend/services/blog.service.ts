import { api } from "@/lib/api";
import { BlogPost, BlogPostSlug } from "@/types/blog.types";

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

  getPostBySlug: async (slug: string): Promise<BlogPostSlug | null> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      // Assuming your backend has a GET /blog/:slug endpoint
      const res = await fetch(`${baseUrl}/blog/${slug}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch blog post");
      }

      const json = await res.json();
      return json.data || null;
    } catch (error) {
      console.error(`BlogService.getPostBySlug Error:`, error);
      return null;
    }
  },
};
