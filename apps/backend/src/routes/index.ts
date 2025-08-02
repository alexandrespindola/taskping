import { Hono } from "hono"
import usersRoute from "./users";

export function registerRoutes(app: Hono) {
    app.route("/users", usersRoute);
}