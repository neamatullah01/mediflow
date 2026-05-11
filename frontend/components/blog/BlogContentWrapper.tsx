"use client";

import { useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { BlogGrid } from "./BlogGrid";
import { BlogPost } from "@/types/blog.types";

export function BlogContentWrapper({
  initialPosts,
}: {
  initialPosts: BlogPost[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  // In a real app, you would fetch from API here when category changes.
  // For the demo, we will filter the existing list.
  const filteredPosts =
    activeCategory === "All"
      ? initialPosts
      : initialPosts.filter(
          (p) => p.category?.toLowerCase() === activeCategory.toLowerCase(),
        );

  return (
    <>
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      {filteredPosts.length > 0 ? (
        <BlogGrid posts={filteredPosts} />
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            No articles found in this category.
          </p>
        </div>
      )}
    </>
  );
}
