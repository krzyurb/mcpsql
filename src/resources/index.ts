import { DatabaseManager } from "../database.js";

export interface ResourceDefinition {
  name: string;
  uri: string;
  description: string;
  handler: () => Promise<any>;
}

export function createResources(dbManager: DatabaseManager): ResourceDefinition[] {
  return [
    {
      name: "database-schema",
      uri: "mysql://schema/database",
      description: "Complete database schema information",
      handler: async () => {
        const schemas = await dbManager.getTableSchemas();
        
        return {
          contents: [{
            uri: "mysql://schema/database",
            mimeType: "application/json",
            text: JSON.stringify(schemas, null, 2)
          }]
        };
      }
    }
  ];
} 