import { Hono } from "hono"
import usersRoute from "./users";
import remindersRoute from "./reminders";

export function registerRoutes(app: Hono) {
    app.route("/users", usersRoute);
    app.route("/reminders", remindersRoute)
}