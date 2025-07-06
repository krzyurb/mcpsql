import { DatabaseManager } from "./database.js";

async function testConnection() {
  const dbManager = new DatabaseManager();
  
  try {
    console.log("Testing database connection...");
    await dbManager.connect();
    
    console.log("✓ Database connection successful");
    
    const tableNames = await dbManager.getTableNames();
    console.log(`✓ Found ${tableNames.length} tables:`, tableNames);
    
    if (tableNames.length > 0) {
      const firstTable = tableNames[0];
      const rowCount = await dbManager.getTableRowCount(firstTable);
      console.log(`✓ Table '${firstTable}' has ${rowCount} rows`);
      
      const schemas = await dbManager.getTableSchemas();
      const firstTableSchema = schemas.find(s => s.tableName === firstTable);
      if (firstTableSchema) {
        console.log(`✓ Table '${firstTable}' has ${firstTableSchema.columns.length} columns`);
      }
    }
    
    await dbManager.disconnect();
    console.log("✓ Database connection closed");
    console.log("\n✅ All tests passed! Your MCP server should work correctly.");
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.log("\nPlease check your .env file and ensure:");
    console.log("1. MySQL server is running");
    console.log("2. Database credentials are correct");
    console.log("3. Database exists and is accessible");
    process.exit(1);
  }
}

testConnection(); 