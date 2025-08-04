import { drizzle } from "drizzle-orm/node-postgres";

// Load environment variables
const databaseUrl = process.env.DATABASE_URL || 
                   "postgres://postgres:Rz5oojtW36eyLlhKUfS3@localhost:54325/taskping";

export const db = drizzle(databaseUrl);

// Connection test
(async () => {
  try {
    await db.execute("SELECT 1");
    console.log("Connection with PostgreSQL via Drizzle OK!");
  } catch (err) {
    console.log("Error when trying to connect with PostgreSQL:", err);
  }
})();
