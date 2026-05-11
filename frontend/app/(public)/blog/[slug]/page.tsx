import { notFound } from "next/navigation";
import { BlogService } from "@/services/blog.service";
import { ArticleDetail } from "@/components/blog/ArticleDetail";

// 1. We define the type for params as a Promise (Next.js 15 standard)
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  // 2. Await the params before using slug
  const { slug } = await params;

  let post: any = await BlogService.getPostBySlug(slug);

  if (!post) {
    const allPosts = await BlogService.getAllPosts();
    post = allPosts.find((p) => p.slug === slug) || null;
  }

  if (!post) return { title: "Blog Post | MediFlow Clinical Insights" };

  return {
    title: `${post.title || "Untitled Article"} | MediFlow Clinical Insights`,
    description: post.excerpt || "No summary available.",
    openGraph: { images: post.coverImage ? [post.coverImage] : [] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  // 3. Await the params here too!
  const { slug } = await params;

  let post = await BlogService.getPostBySlug(slug);

  if (!post) {
    const allPosts = await BlogService.getAllPosts();
    const found = allPosts.find((p) => p.slug === slug);
    if (found) {
      post = {
        ...found,
        content: `<p>${found.excerpt}</p><p>Full content for this article is not available in the preview cache. Please view the live application.</p>`,
        tags: ["Article"],
        createdAt: new Date().toISOString(),
        author: {
          name: "MediFlow Editorial",
          image: null,
        },
      };
    }
  }

  if (!post) {
    const dynamicTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    post = {
      id: "fallback-id",
      slug: slug, // Using the awaited slug
      title: dynamicTitle,
      excerpt:
        "This is a dynamically generated article placeholder for the MediFlow demonstration.",
      content: `
        <h2>Article Details</h2>
        <p>The backend endpoint for this specific article is currently being integrated. However, the frontend routing and component architecture are fully operational.</p>
        <p>This demonstrates the system's ability to gracefully handle missing data without crashing the application during a live clinical environment.</p>
      `,
      category: "SYSTEM LOG",
      readTime: 3,
      coverImage:
        "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
      tags: ["Demo", "Fallback"],
      createdAt: new Date().toISOString(),
      author: {
        name: "MediFlow System",
        image: null,
      },
    };
  }

  return <ArticleDetail post={post} />;
}
