import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "postgres://postgres:Rz5oojtW36eyLlhKUfS3@localhost:54325/taskping",
  },
});
