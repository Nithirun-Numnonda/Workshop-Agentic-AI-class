import { Env } from '../../env';
import { ChatMessage, ChatTurnResult } from '../types';

export async function runGeminiConversation(
  env: Env,
  messages: ChatMessage[],
  model: string
): Promise<ChatTurnResult> {
  if (!env.GEMINI_API_KEY) {
    return {
      reply: 'ขออภัยครับ ยังไม่ได้ตั้งค่า GEMINI_API_KEY ในระบบ',
      toolTrace: [],
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
  
  const formattedMessages = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: formattedMessages })
  });

  if (!response.ok) {
    return {
      reply: `เกิดข้อผิดพลาดในการติดต่อ Gemini: ${response.statusText}`,
      toolTrace: []
    };
  }

  const data = await response.json() as any;
  return {
    reply: data.candidates[0].content.parts[0].text,
    toolTrace: []
  };
}
