import {
  MCPTransport,
  experimental_createMCPClient as createMCPClient,
} from 'ai';

import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export const url = new URL('http://localhost:3000/mcp');

export const client = await createMCPClient({
  transport: new StreamableHTTPClientTransport(url, {
    sessionId: 'session_123',
  }),
});