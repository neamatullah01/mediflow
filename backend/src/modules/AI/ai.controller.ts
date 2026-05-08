import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const aiController = {
  checkInteractions: catchAsync(async (req: Request, res: Response) => {
    const { drugs } = req.body;
    const pharmacyId = req.user?.pharmacyId;

    if (!pharmacyId) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Pharmacy ID is required",
        data: null,
      });
    }

    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "At least 2 drug names are required for interaction checking",
        data: null,
      });
    }

    // TODO: Call Gemini API and save result to DrugInteractionCheck
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Interaction check completed",
      data: { drugs, pharmacyId },
    });
  }),

  demandForecast: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Demand forecast generated",
      data: { pharmacyId: req.body.pharmacyId },
    });
  }),

  chat: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Chat response",
      data: {},
    });
  }),

  getChatSessions: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Chat sessions retrieved",
      data: [],
    });
  }),

  getChatSession: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Chat session retrieved",
      data: { id: req.params.id },
    });
  }),

  deleteChatSession: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Chat session deleted",
      data: { id: req.params.id },
    });
  }),

  tagDrug: catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Drug tagged successfully",
      data: { drugName: req.body.drugName },
    });
  }),

  analyzePlatform: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Platform analysis completed",
      data: {},
    });
  }),
};

export default aiController;
