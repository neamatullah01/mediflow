export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string | null;
  readTime: number;
}

export interface BlogPostSlug {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string | null;
  readTime: number;
  tags: string[];
  createdAt: string;
  author?: {
    name: string;
    image: string | null;
  };
}
