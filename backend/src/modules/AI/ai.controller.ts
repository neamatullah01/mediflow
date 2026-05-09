import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import aiService from './ai.service';
import AppError from '../../errors/AppError';

const aiController = {
  // ─── AI-Powered Endpoints ──────────────────────────────────────────────

  checkInteractions: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const { drugs } = req.body as { drugs: string[] };
    if (!Array.isArray(drugs)) throw new AppError('drugs must be an array of strings', 400);

    const result = await aiService.checkInteractions(pharmacyId, drugs);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drug interaction check completed',
      data: result,
    });
  }),

  demandForecast: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const result = await aiService.generateDemandForecast(pharmacyId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Demand forecast generated successfully',
      data: result,
    });
  }),

  chat: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const pharmacyId = req.user?.pharmacyId;
    if (!userId || !pharmacyId) throw new AppError('Unauthorized', 401);

    const { sessionId, message } = req.body as { sessionId?: string; message: string };

    // If no sessionId provided, create a new session first
    let chatSessionId = sessionId;
    if (!chatSessionId) {
      const session = await aiService.createChatSession(userId, pharmacyId);
      chatSessionId = session.id;
    }

    // Configure SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Send the sessionId as the first event so the client knows which session to use
    res.write(`data: ${JSON.stringify({ sessionId: chatSessionId })}\n\n`);

    await aiService.streamChatSession(chatSessionId, message, res);
  }),

  tagDrug: catchAsync(async (req: Request, res: Response) => {
    const { drugName } = req.body as { drugName: string };
    if (!drugName) throw new AppError('drugName is required', 400);

    const result = await aiService.tagDrug(drugName);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Drug auto-tagged successfully',
      data: result,
    });
  }),

  analyzePlatform: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 501,
      success: false,
      message: 'Platform analytics AI not yet implemented',
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

  createChatSession: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const pharmacyId = req.user?.pharmacyId;
    if (!userId || !pharmacyId) throw new AppError('Unauthorized', 401);

    const session = await aiService.createChatSession(userId, pharmacyId);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Chat session created successfully',
      data: session,
    });
  }),
};

export default aiController;
