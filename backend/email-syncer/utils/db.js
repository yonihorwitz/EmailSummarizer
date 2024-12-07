import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "emaildb",
  port: 5432,
});

export const queries = {
  users: {
    async getById(userId) {
      const result = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userId]
      );
      return result.rows[0];
    },
    async updateLastSync(userId, timestamp) {
      await pool.query(
        "UPDATE users SET last_sync = $1 WHERE id = $2",
        [timestamp, userId]
      );
    }
  },

  emails: {
    async getAll(userId) {
      const result = await pool.query(
        "SELECT * FROM emails WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      return result.rows;
    },

    async create({ userId, emailId, receivedDate, fromEmail, toEmail, subject, body }) {
      const result = await pool.query(
        `INSERT INTO emails (user_id, email_id, received_date, from_email, to_email, subject, body) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         ON CONFLICT (email_id) DO NOTHING
         RETURNING *`,
        [userId, emailId, receivedDate, fromEmail, toEmail, subject, body]
      );
      return result.rows[0];
    },
  }
};
