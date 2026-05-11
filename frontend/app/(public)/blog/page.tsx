// app/(public)/blog/page.tsx

import { BlogService } from "@/services/blog.service";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogContentWrapper } from "@/components/blog/BlogContentWrapper";

export const metadata = {
  title: "Blog | MediFlow Clinical Insights",
  description:
    "Stay updated with the latest in healthcare technology and pharmacology.",
};

export default async function BlogPage() {
  // Server-side initial fetch for SEO
  const initialPosts = await BlogService.getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <BlogHero />

      <main className="container mx-auto px-6 py-16">
        {/* Wrapper to handle stateful filtering */}
        <BlogContentWrapper initialPosts={initialPosts} />
      </main>
    </div>
  );
}
