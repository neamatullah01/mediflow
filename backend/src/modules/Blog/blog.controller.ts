import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const blogController = {
  getPosts: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog posts retrieved successfully',
      data: [],
    });
  }),

  getPostBySlug: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog post retrieved successfully',
      data: { slug: req.params.slug },
    });
  }),

  createPost: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Blog post created successfully',
      data: req.body,
    });
  }),

  updatePost: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog post updated successfully',
      data: { id: req.params.id, ...req.body },
    });
  }),

  deletePost: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog post deleted successfully',
      data: { id: req.params.id },
    });
  }),

  togglePublish: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Publish status toggled',
      data: { id: req.params.id },
    });
  }),
};

export default blogController;
