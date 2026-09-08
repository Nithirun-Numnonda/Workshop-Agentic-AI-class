export function json(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export function errorJson(message: string, status: number = 400): Response {
  return json({ error: message }, status);
}
