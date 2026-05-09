import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import genAI from '../../lib/gemini';
import { getFromCache, setCache, getCacheKey } from '../../lib/cache';
import AppError from '../../errors/AppError';
import {
  INTERACTION_CHECK_PROMPT,
  DEMAND_FORECAST_PROMPT,
  AUTO_TAGGER_PROMPT,
  PLATFORM_ANALYTICS_PROMPT,
  CHATBOT_SYSTEM_PROMPT,
} from './ai.prompts';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Strip markdown code fences (```json ... ```) from Gemini response text */
const stripMarkdown = (text: string): string => {
  return text
    .replace(/^```(?:json)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim();
};

/** Parse Gemini response text into JSON, with clear error on failure */
const parseGeminiJSON = <T>(raw: string): T => {
  const cleaned = stripMarkdown(raw);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new AppError(
      'AI returned invalid JSON. Please try again.',
      502,
    );
  }
};

// ─────────────────────────────────────────────
// AI Feature 1: Drug Interaction Checker
// ─────────────────────────────────────────────

const checkInteractions = async (pharmacyId: string, drugs: string[]) => {
  if (!drugs || drugs.length < 2 || drugs.length > 5) {
    throw new AppError('Provide between 2 and 5 drug names', 400);
  }

  const prompt = INTERACTION_CHECK_PROMPT.replace(
    '{drug_list}',
    drugs.join(', '),
  );

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const parsed = parseGeminiJSON<{
    overall_risk: string;
    summary: string;
    pairs: Array<{
      drug_a: string;
      drug_b: string;
      severity: string;
      reason: string;
      recommendation: string;
    }>;
    disclaimer: string;
  }>(text);

  // Persist to DrugInteractionCheck table
  const riskMap: Record<string, string> = {
    SAFE: 'SAFE',
    MODERATE: 'MODERATE',
    DANGEROUS: 'DANGEROUS',
  };
  const overallRisk = riskMap[parsed.overall_risk?.toUpperCase()] ?? 'MODERATE';

  await prisma.drugInteractionCheck.create({
    data: {
      pharmacyId,
      drugsChecked: drugs,
      overallRisk: overallRisk as 'SAFE' | 'MODERATE' | 'DANGEROUS',
      resultJson: parsed as any,
    },
  });

  return parsed;
};

// ─────────────────────────────────────────────
// AI Feature 2: Demand Forecasting
// ─────────────────────────────────────────────

const generateDemandForecast = async (pharmacyId: string) => {
  const cacheKey = getCacheKey('forecast', pharmacyId);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  // Fetch current inventory
  const inventory = await prisma.inventoryItem.findMany({
    where: { pharmacyId },
    select: {
      drug: { select: { name: true } },
      quantity: true,
      reorderLevel: true,
    },
  });

  // Fetch last 30 days of dispensing logs
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dispensingLogs = await prisma.dispensingLog.findMany({
    where: {
      pharmacyId,
      dispensedAt: { gte: thirtyDaysAgo },
    },
    select: {
      drug: { select: { name: true } },
      quantityDispensed: true,
      dispensedAt: true,
    },
    orderBy: { dispensedAt: 'asc' },
  });

  if (inventory.length === 0) {
    throw new AppError('No inventory data available for forecasting', 400);
  }

  // Format data for prompt injection
  const salesData = dispensingLogs
    .map((log) => `${log.drug.name}: ${log.quantityDispensed} units on ${log.dispensedAt.toISOString().split('T')[0]}`)
    .join('\n');

  const currentStock = inventory
    .map((item) => `${item.drug.name}: ${item.quantity} in stock (reorder level: ${item.reorderLevel})`)
    .join('\n');

  const prompt = DEMAND_FORECAST_PROMPT
    .replace('{sales_data}', salesData || 'No dispensing data in the last 30 days')
    .replace('{current_stock}', currentStock);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const parsed = parseGeminiJSON<{
    generated_at: string;
    forecasts: Array<{
      drug_name: string;
      current_stock: number;
      avg_daily_usage: number;
      days_until_empty: number;
      will_stockout_in_14_days: boolean;
      suggested_order_qty: number;
      urgency: string;
      reasoning: string;
    }>;
    overall_insight: string;
  }>(text);

  // Cache for 6 hours (TTL already set on cache instance)
  setCache(cacheKey, parsed);

  return parsed;
};

// ─────────────────────────────────────────────
// AI Feature 3: Auto Drug Tagger
// ─────────────────────────────────────────────

const tagDrug = async (drugName: string) => {
  if (!drugName || typeof drugName !== 'string') {
    throw new AppError('Valid drug name is required', 400);
  }

  const prompt = AUTO_TAGGER_PROMPT.replace('{drug_name}', drugName);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const parsed = parseGeminiJSON<{
    name: string;
    generic_name: string;
    category: string;
    dosage_form: string;
    description: string;
    uses: string[];
    common_dosage: string;
    side_effects: string[];
    contraindications: string[];
    storage: string;
    manufacturer: string;
  }>(text);

  return parsed;
};

// ─────────────────────────────────────────────
// AI Feature 4: Streaming Chat Session
// ─────────────────────────────────────────────

const streamChatSession = async (
  sessionId: string,
  newMessage: string,
  res: Response,
) => {
  if (!newMessage || typeof newMessage !== 'string') {
    throw new AppError('Message content is required', 400);
  }

  // Fetch or create the chat session
  let session = await prisma.aiChatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!session) {
    throw new AppError('Chat session not found', 404);
  }

  // Build Gemini history from past messages
  const history = session.messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: msg.content }],
  }));

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: CHATBOT_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Understood. I am MediBot, ready to assist with pharmaceutical queries.' }] },
      ...history,
    ],
  });

  // Stream the response
  const stream = await chat.sendMessageStream(newMessage);

  let fullResponse = '';

  for await (const chunk of stream.stream) {
    const text = chunk.text();
    if (text) {
      fullResponse += text;
      // SSE format: data: <content>\n\n
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
  }

  // Send a done event so the client knows the stream ended
  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);

  // Persist user message and AI response to DB
  await prisma.$transaction([
    prisma.aiChatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: newMessage,
      },
    }),
    prisma.aiChatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: fullResponse,
      },
    }),
    // Update session title from first user message if still default
    prisma.aiChatSession.update({
      where: { id: sessionId },
      data: {
        updatedAt: new Date(),
        ...(session.title === 'New Chat'
          ? { title: newMessage.slice(0, 50) }
          : {}),
      },
    }),
  ]);

  res.end();
};

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

const createChatSession = async (userId: string, pharmacyId: string) => {
  const session = await prisma.aiChatSession.create({
    data: {
      userId,
      pharmacyId,
      title: 'New Chat',
    },
  });
  return session;
};

// ─────────────────────────────────────────────
// AI Feature 5: Platform Analytics (Admin-only)
// ─────────────────────────────────────────────

const generatePlatformAnalytics = async () => {
  const [totalPharmacies, totalPharmacists, totalDrugs, inventoryByStatus, ordersByStatus] =
    await Promise.all([
      prisma.pharmacy.count(),
      prisma.user.count({ where: { role: 'PHARMACIST' } }),
      prisma.drug.count(),
      prisma.inventoryItem.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.supplierOrder.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

  const platformData = JSON.stringify({
    totalPharmacies,
    totalPharmacists,
    totalDrugs,
    inventoryByStatus: inventoryByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    ordersByStatus: ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
  }, null, 2);

  const prompt = PLATFORM_ANALYTICS_PROMPT.replace('{platform_data}', platformData);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const parsed = parseGeminiJSON<{
    health_score: number;
    summary: string;
    key_risks: string[];
    recommendations: string[];
  }>(text);

  return parsed;
};

const aiService = {
  checkInteractions,
  generateDemandForecast,
  tagDrug,
  streamChatSession,
  generatePlatformAnalytics,
  getInteractionHistory,
  getInteractionById,
  getChatSessions,
  getChatSession,
  deleteChatSession,
  createChatSession,
};

export default aiService;
