import { DatabaseManager } from "../database.js";
import { createExecuteQueryTool } from "./execute-query.js";
import { createGetTableInfoTool } from "./get-info.js";
import { createListTablesTool } from "./list-tables.js";
import { createGetTableSchemaTool } from "./get-schema.js";
import { versionTool } from "./version.js";

export interface ToolDefinition {
  name: string;
  description: string;
  schema?: any;
  handler: (args?: any) => Promise<any>;
}

export function createTools(dbManager: DatabaseManager): ToolDefinition[] {
  return [
    createExecuteQueryTool(dbManager),
    createGetTableInfoTool(dbManager),
    createListTablesTool(dbManager),
    createGetTableSchemaTool(dbManager),
    versionTool(dbManager)
  ];
} 