import { Hono } from "hono";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import bcrypt from "bcrypt";

const usersRoute = new Hono();

// GET /users
usersRoute.get("/", async (c) => {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users);
  return c.json(allUsers);
});

// GET /users/:id
usersRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  
  const current = await db
    .select()
    .from(users)
    .where(eq(users.id, id));
  if (current.length === 0) {
    return c.json({ error: "User not found." }, 404);
  }
  return c.json(current[0]);
});

// POST /users
usersRoute.post("/", async (c) => {
  const { name, email, password } = await c.req.json();

  // Check if user already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existing.length > 0) {
    return c.json(
      { error: "User with this email already exists." },
      409,
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const inserted = await db
    .insert(users)
    .values({
      name,
      email,
      password: passwordHash,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    });

  return c.json(inserted[0], 201);
});

// PUT /users/:id
usersRoute.put("/:id", async (c) => {
  const { id } = c.req.param();
  const { name, email, password } = await c.req.json();

  // Get current user
  const current = await db
    .select()
    .from(users)
    .where(eq(users.id, id));
  if (current.length === 0) {
    return c.json({ error: "User not found." }, 404);
  }
  const user = current[0];

  // Check if data is the same
  let passwordChanged = false;
  if (password) {
    passwordChanged = !(await bcrypt.compare(
      password,
      user.password,
    ));
  }

  const isSame =
    (name === undefined || user.name === name) &&
    (email === undefined || user.email === email) &&
    (!password || !passwordChanged);

  if (isSame) {
    return c.json({ message: "No changes detected." }, 200);
  }

  // Prepare update data (only include fields that are provided)
  let updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (password && passwordChanged) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updated = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    });

  return c.json(updated[0]);
});

// DELETE /users/:id
usersRoute.delete("/:id", async (c) => {
  const { id } = c.req.param();

  const deleted = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    });

  if (deleted.length === 0) {
    return c.json({ error: "User not found." }, 404);
  }

  return c.json({
    message: "User deleted.",
    user: deleted,
  });
});

export default usersRoute;
