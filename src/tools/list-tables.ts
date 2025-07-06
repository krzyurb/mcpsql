import { DatabaseManager } from "../database.js";
import { ToolDefinition } from "./index.js";

export function createListTablesTool(dbManager: DatabaseManager): ToolDefinition {
  return {
    name: "list-tables",
    description: "List all available tables in the database",
    handler: async () => {
      try {
        const tableNames = await dbManager.getTableNames();
        
        return {
          content: [{
            type: "text",
            text: `Available tables:\n${tableNames.map(name => `- ${name}`).join('\n')}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error listing tables: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  };
} 