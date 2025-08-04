import { Hono } from "hono";
import { registerRoutes } from "./routes";

const app = new Hono();

app.get("/", (c) => c.text("TaskPing API - Hono + Bun Backend"));

registerRoutes(app);

const port = process.env.PORT || 3000;

export default {
  fetch: app.fetch,
  port: parseInt(port.toString()),
  hostname: "0.0.0.0",
};
