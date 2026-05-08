import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config';

if (!env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
  },
});

export const geminiProModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.5,
    maxOutputTokens: 4096,
  },
});

export default genAI;
