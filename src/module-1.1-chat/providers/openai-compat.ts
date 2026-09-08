import { Env } from '../../env';
import { ChatMessage, ChatTurnResult } from '../types';

export async function runOpenAiCompatConversation(
  env: Env,
  messages: ChatMessage[],
  model: string,
  baseUrl: string,
  apiKey: string
): Promise<ChatTurnResult> {
  if (!apiKey || !baseUrl) {
    return {
      reply: 'ขออภัยครับ ยังไม่ได้ตั้งค่า API Key หรือ Base URL สำหรับ Provider นี้',
      toolTrace: [],
    };
  }

  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  });

  if (!response.ok) {
    return {
      reply: `เกิดข้อผิดพลาดในการติดต่อ Provider: ${response.statusText}`,
      toolTrace: []
    };
  }

  const data = await response.json() as any;
  return {
    reply: data.choices[0].message.content,
    toolTrace: []
  };
}
