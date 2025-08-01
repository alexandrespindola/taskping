import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(
  "postgres://postgres:Rz5oojtW36eyLlhKUfS3@localhost:54325/taskping"
);

// Connection test
(async () => {
  try {
    await db.execute("SELECT 1");
    console.log("Connection with PostgreSQL via Drizzle OK!");
  } catch (err) {
    console.log("Error when trying to connect with PostgreSQL:", err);
  }
})();
