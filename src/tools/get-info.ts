import { z } from "zod";
import { DatabaseManager } from "../database.js";
import { ToolDefinition } from "./index.js";

export function createGetTableInfoTool(dbManager: DatabaseManager): ToolDefinition {
  return {
    name: "get-table-info",
    description: "Get detailed information about a specific table",
    schema: {
      tableName: z.string().describe("The name of the table to get information about")
    },
    handler: async (args: { tableName: string }) => {
      const { tableName } = args;
      
      try {
        const schemas = await dbManager.getTableSchemas();
        const tableSchema = schemas.find(s => s.tableName === tableName);
        
        if (!tableSchema) {
          return {
            content: [{
              type: "text",
              text: `Table '${tableName}' not found. Available tables: ${schemas.map(s => s.tableName).join(', ')}`
            }]
          };
        }

        const rowCount = await dbManager.getTableRowCount(tableName);
        
        return {
          content: [{
            type: "text",
            text: `Table: ${tableName}\nRow count: ${rowCount}\n\nSchema:\n${JSON.stringify(tableSchema, null, 2)}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error getting table info: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  };
} 