import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DatabaseManager } from "./database.js";
import { createTools } from "./tools/index.js";
import { createResources } from "./resources/index.js";

const server = new McpServer({
  name: process.env.MCP_SERVER_NAME || "mcpsql",
  version: process.env.MCP_SERVER_VERSION || "1.0.0"
});

const dbManager = new DatabaseManager();

// Connect to database on startup
await dbManager.connect();

// Create tools and resources
const tools = createTools(dbManager);
const resources = createResources(dbManager);

// Register resources
resources.forEach(resource => {
  server.resource(
    resource.name,
    resource.uri,
    {
      description: resource.description
    },
    resource.handler
  );
});

// Register tools
tools.forEach(tool => {
  if (tool.schema) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema,
      tool.handler
    );
  } else {
    server.tool(
      tool.name,
      tool.description,
      tool.handler
    );
  }
});

// Cleanup on exit
process.on('SIGINT', async () => {
  console.log('Shutting down MCP server...');
  await dbManager.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down MCP server...');
  await dbManager.disconnect();
  process.exit(0);
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);

console.log('MySQL MCP Server started'); 