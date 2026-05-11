"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types/blog.types";

const defaultImages = [
  "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800",
];

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/blog/${post.slug}`} className="group h-full flex">
              <Card className="flex flex-col h-full rounded-2xl overflow-hidden border-border/40 bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-0">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.coverImage || defaultImages[index % 3]}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary mb-3 uppercase tracking-widest">
                    {post.category || "General"} • {post.readTime} min read
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto text-primary font-semibold text-sm flex items-center gap-1">
                    Read Full Article
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
