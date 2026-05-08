import slugify from 'slugify';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { getSkip, calculateTotalPages } from '../../utils/pagination';
import type { CreateBlogPostPayload, UpdateBlogPostPayload } from './blog.validation';

interface BlogQuery {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  category?: string | undefined;
}

const generateUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  let base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
};

const getPosts = async (query: BlogQuery) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = getSkip(page, limit);

  const where: any = { isPublished: true };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { excerpt: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.category) where.category = { equals: query.category, mode: 'insensitive' };

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    meta: { page, limit, total, totalPages: calculateTotalPages(total, limit) },
  };
};

const getPostBySlug = async (slug: string) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  if (!post || !post.isPublished) throw new AppError('Blog post not found', 404);

  // Increment views
  await prisma.blogPost.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });

  // Fetch related posts in same category
  const relatedPosts = post.category
    ? await prisma.blogPost.findMany({
        where: {
          category: post.category,
          isPublished: true,
          id: { not: post.id },
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          createdAt: true,
          readTime: true,
        },
      })
    : [];

  return { ...post, views: post.views + 1, relatedPosts };
};

const createPost = async (authorId: string, payload: CreateBlogPostPayload) => {
  const slug = await generateUniqueSlug(payload.title);

  const post = await prisma.blogPost.create({
    data: {
      authorId,
      title: payload.title,
      slug,
      excerpt: payload.excerpt,
      content: payload.content,
      coverImage: payload.coverImage ?? null,
      category: payload.category ?? null,
      tags: payload.tags ?? [],
      readTime: payload.readTime ?? 5,
      isPublished: payload.isPublished ?? false,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  return post;
};

const updatePost = async (id: string, payload: UpdateBlogPostPayload) => {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError('Blog post not found', 404);

  let slug = existing.slug;
  if (payload.title && payload.title !== existing.title) {
    slug = await generateUniqueSlug(payload.title, id);
  }

  const updateData: any = {
    ...payload,
    slug,
  };

  const updated = await prisma.blogPost.update({
    where: { id },
    data: updateData,
    include: { author: { select: { id: true, name: true } } },
  });

  return updated;
};

const deletePost = async (id: string) => {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError('Blog post not found', 404);
  await prisma.blogPost.delete({ where: { id } });
};

const togglePublish = async (id: string) => {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError('Blog post not found', 404);

  const updated = await prisma.blogPost.update({
    where: { id },
    data: { isPublished: !existing.isPublished },
    include: { author: { select: { id: true, name: true } } },
  });

  return updated;
};

const blogService = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
};

export default blogService;
