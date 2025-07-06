import { z } from "zod";
import { DatabaseManager } from "../database.js";
import { ToolDefinition } from "./index.js";

export function createExecuteQueryTool(dbManager: DatabaseManager): ToolDefinition {
  return {
    name: "execute-sql-query",
    description: "Execute a read-only SQL query against the database",
    schema: {
      query: z.string().describe("The SQL query to execute")
    },
    handler: async (args: { query: string }) => {
      const { query } = args;
      
      try {
        const results = await dbManager.executeReadOnlyQuery(query);
        
        return {
          content: [{
            type: "text",
            text: `Query executed successfully. Found ${results.length} rows.\n\nResults:\n${JSON.stringify(results, null, 2)}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error executing query: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  };
} 