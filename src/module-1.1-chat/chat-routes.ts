import { Env } from '../env';
import { json, errorJson } from '../lib/http';
import { ChatMessage, ChatProvider } from './types';
import { runGeminiConversation } from './providers/gemini';
import { runOpenAiCompatConversation } from './providers/openai-compat';

function resolveProvider(provider: string | undefined, env: Env): ChatProvider {
  if (provider === 'gemini' || provider === 'openai' || provider === 'openai-compat') {
    return provider;
  }
  return (env.DEFAULT_CHAT_PROVIDER as ChatProvider) || 'gemini';
}

function defaultModelFor(provider: ChatProvider, env: Env): string {
  switch (provider) {
    case 'gemini': return env.GEMINI_MODEL || 'gemini-1.5-flash';
    case 'openai': return env.OPENAI_MODEL || 'gpt-4o';
    case 'openai-compat': return env.OPENAI_COMPAT_MODEL || 'gpt-4o';
  }
}

function buildSystemPrompt(): string {
  return "คุณคือผู้ช่วย AI ที่ชาญฉลาดและตอบคำถามเป็นภาษาไทย";
}

export async function handleChatRoute(request: Request, env: Env): Promise<Response> {
  const { message, history, provider: rawProvider, model: rawModel } = await request.json() as any;
  
  if (!message) return errorJson('Message is required');

  const provider = resolveProvider(rawProvider, env);
  const model = rawModel || defaultModelFor(provider, env);
  const messages: ChatMessage[] = [
    { role: 'assistant', content: buildSystemPrompt() },
    ...(history || []),
    { role: 'user', content: message }
  ];

  let result;
  if (provider === 'gemini') {
    result = await runGeminiConversation(env, messages, model);
  } else if (provider === 'openai') {
    result = await runOpenAiCompatConversation(env, messages, model, 'https://api.openai.com/v1', env.OPENAI_API_KEY || '');
  } else {
    result = await runOpenAiCompatConversation(env, messages, model, env.OPENAI_COMPAT_BASE_URL || '', env.OPENAI_COMPAT_API_KEY || '');
  }

  return json(result);
}
