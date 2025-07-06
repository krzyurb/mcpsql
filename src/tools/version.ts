import { DatabaseManager } from "../database.js";
import { ToolDefinition } from "./index.js";

export function versionTool(dbManager: DatabaseManager): ToolDefinition {
  return {
    name: "mysql-version",
    description: "Get MySQL server version",
    handler: async () => {
      try {
        const version = await dbManager.getVersion();

        return {
          content: [{
            type: "text",
            text: `MySQL server version: ${version}`,
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error getting MySQL version: ${error instanceof Error ? error.message : 'Unknown error'}`,
          }]
        };
      }
    }
  };
} 