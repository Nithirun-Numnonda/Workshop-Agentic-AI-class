import { Env } from './env';
import { handleChatRoute } from './module-1.1-chat/chat-routes';

export async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/healthz') {
    return new Response('OK', { status: 200 });
  }

  if (path === '/api/chat' && request.method === 'POST') {
    return handleChatRoute(request, env);
  }

  // Handle static assets for the chat interface
  if (path.startsWith('/chat')) {
    return env.ASSETS.fetch(request);
  }

  return new Response('Not Found', { status: 404 });
}
