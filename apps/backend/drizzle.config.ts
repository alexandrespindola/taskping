import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL_NEON_DEV || process.env.DATABASE_URL_DOCKER || "postgres://postgres:Rz5oojtW36eyLlhKUfS3@localhost:54325/taskping",
  },
});