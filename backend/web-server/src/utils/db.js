import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "emaildb",
  port: 5432,
});

const createDatabase = async () => {
  // Connect to default 'postgres' database first
  const pgPool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: "postgres", // Connect to default database
    port: 5432,
  });

  try {
    // Check if database exists
    const dbExists = await pgPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      ["emaildb"]
    );

    if (dbExists.rows.length === 0) {
      // Create the database if it doesn't exist
      await pgPool.query("CREATE DATABASE emaildb");
    }
  } finally {
    await pgPool.end();
  }
};

const createTables = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        nylas_token TEXT,
        last_sync TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        email_id TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        body TEXT,
        from_email TEXT,
        to_email TEXT,
        category TEXT,
        summary TEXT,
        processed BOOLEAN DEFAULT FALSE,
        received_date TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
};

// Database initialization
export const initDB = async () => {
  try {
    await createDatabase();
    const client = await pool.connect();
    try {
      await createTables(client);
      console.log("Database initialized successfully");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

export const queries = {
  users: {
    async get(id) {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
      return result.rows[0];
    },
    async create({ email, nylasToken }) {
      const result = await pool.query(
        `INSERT INTO users (email, nylas_token) 
         VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE 
         SET nylas_token = $2
         RETURNING *`,
        [email, nylasToken]
      );
      return result.rows[0];
    },
  },

  emails: {
    async getAll(userId) {
      const result = await pool.query(
        "SELECT * FROM emails WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      return result.rows;
    },
  }
}; 
