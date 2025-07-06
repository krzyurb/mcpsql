import { z } from "zod";
import { DatabaseManager } from "../database.js";
import { ToolDefinition } from "./index.js";

export function createGetTableSchemaTool(dbManager: DatabaseManager): ToolDefinition {
  return {
    name: "get-table-schema",
    description: "Get the schema for a specific table",
    schema: {
      tableName: z.string().describe("The name of the table to get schema for")
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
        
        return {
          content: [{
            type: "text",
            text: `Schema for table '${tableName}':\n${JSON.stringify(tableSchema, null, 2)}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error getting table schema: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  };
} 