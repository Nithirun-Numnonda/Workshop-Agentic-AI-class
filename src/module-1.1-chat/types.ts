export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatProvider = 'gemini' | 'openai' | 'openai-compat';

export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface ToolTraceEntry {
  toolName: string;
  args: any;
  result: any;
}

export interface ChatTurnResult {
  reply: string;
  toolTrace: ToolTraceEntry[];
}

export type ToolCaller = (
  tools: McpTool[],
  messages: ChatMessage[]
) => Promise<ChatTurnResult>;

export function toolFunctionName(serverId: string, toolName: string): string {
  return `${serverId}__${toolName}`;
}
