"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPostSlug } from "@/types/blog.types";

import { toast } from "react-hot-toast";

export function ArticleDetail({ post }: { post: BlogPostSlug }) {
  // Format the date nicely
  const formattedDate = post?.createdAt 
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* 1. Header Section */}
      <header className="pt-24 pb-12 bg-slate-50 dark:bg-slate-900/40 border-b border-border/50">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all articles
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-sm font-bold tracking-wider uppercase text-primary mb-6"
          >
            <span>{post.category || "General"}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
          >
            {post.title || "Untitled Article"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
          >
            {post.excerpt || "No summary is currently available for this article."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-border/50"
          >
            {/* Author Info */}
            <div className="flex items-center gap-3">
              {post.author?.image ? (
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-background shadow-sm"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {post.author?.name?.charAt(0) || "M"}
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {post.author?.name || "MediFlow Team"}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime || 1} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <Button
              variant="outline"
              className="rounded-full gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => toast("Share feature coming soon!", { icon: "🚧" })}
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </motion.div>
        </div>
      </header>

      {/* 2. Cover Image */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="container mx-auto px-6 max-w-5xl -mt-8 relative z-20"
        >
          <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* 3. Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto px-6 max-w-3xl mt-16"
      >
        {/* Using dangerouslySetInnerHTML because Prisma stores HTML content from rich text editors.
          We use custom prose styling classes to make sure standard HTML tags look beautiful.
        */}
        <div
          className="prose prose-slate dark:prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content || "<p>Content for this article is currently being prepared. Please check back later.</p>" }}
        />

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border/50">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Related Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </article>
  );
}
