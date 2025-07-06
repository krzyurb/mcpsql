# MySQL MCP Server

A simple Model Context Protocol (MCP) server that connects to your MySQL database and provides tools for database exploration and querying.

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure your database:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your MySQL database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```

## Building and Running

1. Build the TypeScript code:
   ```bash
   $ npm run build
   $ npm start
    ```

## MCP Client Configuration

Add this server to your MCP client configuration. For example for gemini create `.gemini/settings.json`:

```json
{
  "mcpServers": [
    {
      "name": "mcpsql",
      "command": "node",
      "args": ["/path/to/your/mcp/server/dist/server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "3306",
        "DB_USER": "db_user",
        "DB_PASSWORD": "db_pass",
        "DB_NAME": "db_name"
      }
    }
  ]
}
```