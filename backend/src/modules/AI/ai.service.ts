import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';

// ─────────────────────────────────────────────
// Interaction History (non-AI — reads from DB)
// ─────────────────────────────────────────────

const getInteractionHistory = async (
  pharmacyId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const [checks, total] = await Promise.all([
    prisma.drugInteractionCheck.findMany({
      where: { pharmacyId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        drugsChecked: true,
        overallRisk: true,
        createdAt: true,
      },
    }),
    prisma.drugInteractionCheck.count({ where: { pharmacyId } }),
  ]);

  return {
    checks,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getInteractionById = async (pharmacyId: string, id: string) => {
  const check = await prisma.drugInteractionCheck.findFirst({
    where: { id, pharmacyId },
  });

  if (!check) throw new AppError('Interaction check not found', 404);
  return check;
};

// ─────────────────────────────────────────────
// Chat Sessions (non-AI — reads from DB)
// ─────────────────────────────────────────────

const getChatSessions = async (userId: string, pharmacyId: string) => {
  const sessions = await prisma.aiChatSession.findMany({
    where: { userId, pharmacyId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  });

  return sessions;
};

const getChatSession = async (
  userId: string,
  pharmacyId: string,
  sessionId: string,
) => {
  const session = await prisma.aiChatSession.findFirst({
    where: { id: sessionId, userId, pharmacyId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!session) throw new AppError('Chat session not found', 404);
  return session;
};

const deleteChatSession = async (
  userId: string,
  pharmacyId: string,
  sessionId: string,
) => {
  const session = await prisma.aiChatSession.findFirst({
    where: { id: sessionId, userId, pharmacyId },
  });

  if (!session) throw new AppError('Chat session not found', 404);
  await prisma.aiChatSession.delete({ where: { id: sessionId } });
};

const aiService = {
  getInteractionHistory,
  getInteractionById,
  getChatSessions,
  getChatSession,
  deleteChatSession,
};

export default aiService;
