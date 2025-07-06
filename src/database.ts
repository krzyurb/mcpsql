import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface TableSchema {
  tableName: string;
  columns: ColumnInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  key: string;
  default: string | null;
  extra: string;
}

interface MySQLColumnInfo {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}

export class DatabaseManager {
  private connection: mysql.Connection | null = null;
  private config: DatabaseConfig;

  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || ''
    };
  }

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('Connected to MySQL database');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log('Disconnected from MySQL database');
    }
  }

  async getTableSchemas(): Promise<TableSchema[]> {
    if (!this.connection) {
      throw new Error('Database not connected');
    }

    const [tables] = await this.connection.execute(
      'SHOW TABLES'
    ) as [any[], mysql.FieldPacket[]];

    const schemas: TableSchema[] = [];

    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0] as string;
      const [columns] = await this.connection.execute(
        `DESCRIBE \`${tableName}\``
      ) as [MySQLColumnInfo[], mysql.FieldPacket[]];

      schemas.push({
        tableName,
        columns: columns.map(col => ({
          name: col.Field,
          type: col.Type,
          nullable: col.Null === 'YES',
          key: col.Key,
          default: col.Default,
          extra: col.Extra
        }))
      });
    }

    return schemas;
  }

  async executeReadOnlyQuery(query: string): Promise<any[]> {
    if (!this.connection) {
      throw new Error('Database not connected');
    }

    // Basic security check - only allow SELECT queries
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery.startsWith('select')) {
      throw new Error('Only SELECT queries are allowed for security reasons');
    }

    try {
      const [rows] = await this.connection.execute(query);
      return rows as any[];
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }

  async getTableNames(): Promise<string[]> {
    if (!this.connection) {
      throw new Error('Database not connected');
    }

    const [tables] = await this.connection.execute(
      'SHOW TABLES'
    ) as [any[], mysql.FieldPacket[]];

    return tables.map(tableRow => Object.values(tableRow)[0] as string);
  }

  async getTableRowCount(tableName: string): Promise<number> {
    if (!this.connection) {
      throw new Error('Database not connected');
    }

    const [result] = await this.connection.execute(
      `SELECT COUNT(*) as count FROM \`${tableName}\``
    ) as [any[], mysql.FieldPacket[]];

    return result[0].count;
  }

  async getVersion(): Promise<string> {
    if (!this.connection) {
      throw new Error('Database not connected');
    }

    const [result] = await this.connection.execute(
      'SELECT VERSION() AS version'
    ) as [any[], mysql.FieldPacket[]];

    return result[0].version;
  }
} 