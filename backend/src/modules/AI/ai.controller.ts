import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import aiService from './ai.service';
import AppError from '../../errors/AppError';

const aiController = {
  // ─── AI Endpoints (no AI integration per user request) ───────────────────
  checkInteractions: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 501,
      success: false,
      message: 'AI integration not enabled. Configure GEMINI_API_KEY to activate.',
      data: null,
    });
  }),

  demandForecast: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 501,
      success: false,
      message: 'AI integration not enabled. Configure GEMINI_API_KEY to activate.',
      data: null,
    });
  }),

  chat: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 501,
      success: false,
      message: 'AI integration not enabled. Configure GEMINI_API_KEY to activate.',
      data: null,
    });
  }),

  tagDrug: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 501,
      success: false,
      message: 'AI integration not enabled. Configure GEMINI_API_KEY to activate.',
      data: null,
    });
  }),

  analyzePlatform: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 501,
      success: false,
      message: 'AI integration not enabled. Configure GEMINI_API_KEY to activate.',
      data: null,
    });
  }),

  // ─── Interaction History (reads from DB — no AI needed) ──────────────────
  getInteractionHistory: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const { page, limit } = req.query;
    const result = await aiService.getInteractionHistory(
      pharmacyId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Interaction history retrieved successfully',
      meta: result.meta,
      data: result.checks,
    });
  }),

  getInteractionById: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const interactionId = req.params.id;
    if (typeof interactionId !== 'string' || !interactionId) {
      throw new AppError('Valid interaction ID is required', 400);
    }

    const check = await aiService.getInteractionById(pharmacyId, interactionId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Interaction check retrieved successfully',
      data: check,
    });
  }),

  // ─── Chat Sessions (reads from DB — no AI needed) ────────────────────────
  getChatSessions: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const pharmacyId = req.user?.pharmacyId;
    if (!userId || !pharmacyId) throw new AppError('Unauthorized', 401);

    const sessions = await aiService.getChatSessions(userId, pharmacyId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Chat sessions retrieved successfully',
      data: sessions,
    });
  }),

  getChatSession: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const pharmacyId = req.user?.pharmacyId;
    if (!userId || !pharmacyId) throw new AppError('Unauthorized', 401);

    const sessionId = req.params.id;
    if (typeof sessionId !== 'string') throw new AppError('Invalid session ID', 400);
    const session = await aiService.getChatSession(userId, pharmacyId, sessionId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Chat session retrieved successfully',
      data: session,
    });
  }),

  deleteChatSession: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const pharmacyId = req.user?.pharmacyId;
    const sessionId = req.params.id;
    if (!userId || !pharmacyId) throw new AppError('Unauthorized', 401);
    if (!sessionId || Array.isArray(sessionId)) throw new AppError('Invalid session ID', 400);

    await aiService.deleteChatSession(userId, pharmacyId, sessionId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Chat session deleted successfully',
      data: null,
    });
  }),
};

export default aiController;
