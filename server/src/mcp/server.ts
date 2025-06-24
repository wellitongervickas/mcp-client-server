import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

// Create an MCP server
export const server = new McpServer({
  name: "demo-server",
  version: "1.0.0"
});

// Add an addition tool
server.registerTool("add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() }
  },
  async ({ a, b }) => {
    console.log('sum:', a + b)
    return {
      content: [{ type: "text", text: String(a + b) }]
    }
  }
);

// Static resource
server.registerResource(
  "config",
  "config://app",
  {
    title: "Application Config",
    description: "Application configuration data",
    mimeType: "text/plain"
  },
  async (uri: URL) => ({
    contents: [{
      uri: uri.href,
      text: "App configuration here"
    }]
  })
);

// Add a dynamic greeting resource
server.registerResource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  { 
    title: "Greeting Resource",      // Display name for UI
    description: "Dynamic greeting generator"
  },
  async (uri: URL) => {
    console.log('greeting', uri)
    const name = uri.pathname.replace(/^\//, "");
    return {
      contents: [{
        uri: uri.href,
        text: `Hello, ${name}!`
      }]
    };
  }
);

export const getTransport = (): StreamableHTTPServerTransport => {
  return new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
}

export default server