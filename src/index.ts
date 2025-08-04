import { Hono } from "hono";
import { registerRoutes } from "./routes";

const app = new Hono();

app.get("/", (c) => c.text("TaskPing API - Hono + Bun Backend"));

registerRoutes(app);

// Railway precisa porta dinâmica e hostname 0.0.0.0
const port = process.env.PORT || 3009;

if (import.meta.main) {
  Bun.serve({
    fetch: app.fetch,
    port: parseInt(port.toString()),
    hostname: "0.0.0.0", // Importante para deploy
  });
  console.log(`🚀 TaskPing API running on http://0.0.0.0:${port}`);
}

export default app;
