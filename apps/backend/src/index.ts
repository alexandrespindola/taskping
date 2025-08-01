import { Hono } from "hono";
import "./db/index.ts"

const app = new Hono();

app.get("/", (c) => c.text("Hello from Hono + Bun"));

if (import.meta.main) {
    Bun.serve({
        fetch: app.fetch,
        port: 3009
    })
    console.log('Bun serving on http://localhost:3009')
}