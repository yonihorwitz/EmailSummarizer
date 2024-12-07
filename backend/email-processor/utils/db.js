import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "emaildb",
  port: 5432,
});

// Query builders
export const queries = {
  emails: {
    async getById(id) {
      const result = await pool.query(
        "SELECT * FROM emails WHERE id = $1",
        [id]
      );
      return result.rows[0];
    },
    async updateEmail(id, { category, summary }) {
      await pool.query(
        "UPDATE emails SET category = $1, summary = $2, processed = TRUE WHERE id = $3",
        [category, summary, id]
      );
    },
  }
};
