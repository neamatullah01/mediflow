import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BlogService } from "@/services/blog.service";

export async function BlogPreviewSection() {
  // Fetch dynamic data from your backend
  const blogPosts = await BlogService.getLatestPosts(3);

  const displayPosts =
    blogPosts.length > 0
      ? blogPosts
      : [
          {
            id: "1",
            category: "PHARMACOLOGY",
            readTime: 5,
            title: "The Future of AI in Drug Interaction Prevention",
            excerpt:
              "How large language models are closing the gap in complex pharmaceutical safety protocols...",
            coverImage:
              "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800",
            slug: "future-of-ai-drug-interactions",
          },
          {
            id: "2",
            category: "LOGISTICS",
            readTime: 8,
            title: "Optimizing Inventory for Rural Pharmacies",
            excerpt:
              "Leveraging predictive analytics to solve the logistical challenges of remote healthcare delivery...",
            coverImage:
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
            slug: "optimizing-inventory-rural",
          },
          {
            id: "3",
            category: "INDUSTRY",
            readTime: 4,
            title: "Regulatory Compliance in the Digital Age",
            excerpt:
              "Understanding the evolving landscape of digital prescription audits and data privacy laws...",
            coverImage:
              "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
            slug: "regulatory-compliance-digital",
          },
        ];

  return (
    <section className="py-20 md:py-28 bg-background border-t border-border/40">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Clinical Insights Blog
          </h2>
          <Link
            href="/blog"
            className="group flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all articles
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full"
            >
              <Card className="flex flex-col h-full rounded-xl overflow-hidden border border-border/40 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-0">
                <div className="relative w-full aspect-video overflow-hidden shrink-0 m-0 p-0">
                  <img
                    src={post.coverImage || "/images/placeholder-blog.jpg"}
                    alt={post.title}
                    className="block object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none" />
                </div>

                <CardContent className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-wider uppercase text-primary mb-3">
                      <span>{post.category || "GENERAL"}</span>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="text-muted-foreground">
                        {post.readTime} MIN READ
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
