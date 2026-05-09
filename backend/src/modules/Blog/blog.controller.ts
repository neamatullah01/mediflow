import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createBlogPostSchema, updateBlogPostSchema } from './blog.validation';
import blogService from './blog.service';
import AppError from '../../errors/AppError';

const blogController = {
  getPosts: catchAsync(async (req: Request, res: Response) => {
    const { page, limit, search, category, isPublished } = req.query;
    const isAdmin = req.user?.role === 'ADMIN';

    const result = await blogService.getPosts(
      {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string | undefined,
        category: category as string | undefined,
        isPublished: isPublished as string | undefined,
      },
      isAdmin,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog posts retrieved successfully',
      meta: result.meta,
      data: result.posts,
    });
  }),

  getPostBySlug: catchAsync(async (req: Request, res: Response) => {
    const post = await blogService.getPostBySlug(req.params.slug as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog post retrieved successfully',
      data: post,
    });
  }),

  createPost: catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user?.id;
    if (!authorId) throw new AppError('Unauthorized', 401);

    const validated = createBlogPostSchema.parse(req.body);
    const post = await blogService.createPost(authorId, validated);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Blog post created successfully',
      data: post,
    });
  }),

  updatePost: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || Array.isArray(id)) throw new AppError('Invalid post ID', 400);

    const validated = updateBlogPostSchema.parse(req.body);
    const post = await blogService.updatePost(id, validated);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  }),

  deletePost: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || Array.isArray(id)) throw new AppError('Invalid post ID', 400);

    await blogService.deletePost(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog post deleted successfully',
      data: null,
    });
  }),

  togglePublish: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || Array.isArray(id)) throw new AppError('Invalid post ID', 400);

    const post = await blogService.togglePublish(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Blog post ${post.isPublished ? 'published' : 'unpublished'} successfully`,
      data: post,
    });
  }),
};

export default blogController;
