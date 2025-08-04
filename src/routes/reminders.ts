import { Hono } from "hono";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
import { reminders } from "../db/schema";

const remindersRoute = new Hono();

// GET /reminders
remindersRoute.get("/", async (c) => {
  const allReminders = await db
    .select({
      id: reminders.id,
      userId: reminders.userId,
      title: reminders.title,
      message: reminders.message,
      remindAt: reminders.remindAt,
      sendByEmail: reminders.sendByEmail,
      emailRecipient: reminders.emailRecipient,
      sendByWhatsapp: reminders.sendByWhatsapp,
      whatsappRecipient: reminders.whatsappRecipient,
      sent: reminders.sent,
      createdAt: reminders.createdAt,
    })
    .from(reminders);
  return c.json(allReminders);
});

// GET /reminders/:id
remindersRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  const reminderId = Number(id);

  const current = await db
    .select()
    .from(reminders)
    .where(eq(reminders.id, reminderId));
  if (current.length === 0) {
    return c.json({ error: "Reminder not found." }, 404);
  }
  return c.json(current[0]);
});

// POST /reminders
remindersRoute.post("/", async (c) => {
  const {
    userId,
    title,
    message,
    remindAt,
    sendByEmail,
    emailRecipient,
    sendByWhatsapp,
    whatsappRecipient,
  } = await c.req.json();

  const remindAtDate = new Date(remindAt);

  // Validate date format
  if (isNaN(remindAtDate.getTime())) {
    return c.json(
      {
        error:
          "Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).",
      },
      400,
    );
  }

  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(remindAt)
  ) {
    return c.json(
      {
        error:
          "Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).",
      },
      400,
    );
  }

  const inserted = await db
    .insert(reminders)
    .values({
      userId,
      title,
      message,
      remindAt: remindAtDate,
      sendByEmail,
      emailRecipient,
      sendByWhatsapp,
      whatsappRecipient,
    })
    .returning({
      id: reminders.id,
      userId: reminders.userId,
      title: reminders.title,
      message: reminders.message,
      remindAt: reminders.remindAt,
      sendByEmail: reminders.sendByEmail,
      emailRecipient: reminders.emailRecipient,
      sendByWhatsapp: reminders.sendByWhatsapp,
      whatsappRecipient: reminders.whatsappRecipient,
      sent: reminders.sent,
      createdAt: reminders.createdAt,
    });

  return c.json(inserted[0], 201);
});

// PUT /reminders/:id
remindersRoute.put("/:id", async (c) => {
  const { id } = c.req.param();
  const reminderId = Number(id);
  const {
    title,
    message,
    remindAt,
    sendByEmail,
    emailRecipient,
    sendByWhatsapp,
    whatsappRecipient,
  } = await c.req.json();

  // Get current reminder
  const current = await db
    .select()
    .from(reminders)
    .where(eq(reminders.id, reminderId));
  if (current.length === 0) {
    return c.json({ error: "Reminder not found." }, 404);
  }
  const reminder = current[0];

  let remindAtDate: Date | undefined = undefined;
  if (remindAt !== undefined) {
    // Validação da data com regex ISO 8601
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    if (!isoDateRegex.test(remindAt)) {
      return c.json({ 
        error: "Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)" 
      }, 400);
    }

    const date = new Date(remindAt);
    if (isNaN(date.getTime())) {
      return c.json({ error: "Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ" }, 400);
    }

    remindAtDate = date;
  }

  // Check if data is the same
  const isSame =
    (title === undefined || reminder.title === title) &&
    (message === undefined ||
      reminder.message === message) &&
    (remindAt === undefined ||
      (remindAtDate &&
        reminder.remindAt?.getTime() ===
          remindAtDate.getTime())) &&
    (sendByEmail === undefined ||
      reminder.sendByEmail === sendByEmail) &&
    (emailRecipient === undefined ||
      reminder.emailRecipient === emailRecipient) &&
    (sendByWhatsapp === undefined ||
      reminder.sendByWhatsapp === sendByWhatsapp) &&
    (whatsappRecipient === undefined ||
      reminder.whatsappRecipient === whatsappRecipient);

  if (isSame) {
    return c.json({ message: "No changes detected." }, 200);
  }

  let updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (message !== undefined) updateData.message = message;
  if (remindAt !== undefined)
    updateData.remindAt = remindAtDate;
  if (sendByEmail !== undefined)
    updateData.sendByEmail = sendByEmail;
  if (emailRecipient !== undefined)
    updateData.emailRecipient = emailRecipient;
  if (sendByWhatsapp !== undefined)
    updateData.sendByWhatsapp = sendByWhatsapp;
  if (whatsappRecipient !== undefined)
    updateData.whatsappRecipient = whatsappRecipient;

  const updated = await db
    .update(reminders)
    .set(updateData)
    .where(eq(reminders.id, reminderId))
    .returning({
      id: reminders.id,
      userId: reminders.userId,
      title: reminders.title,
      message: reminders.message,
      remindAt: reminders.remindAt,
      sendByEmail: reminders.sendByEmail,
      emailRecipient: reminders.emailRecipient,
      sendByWhatsapp: reminders.sendByWhatsapp,
      whatsappRecipient: reminders.whatsappRecipient,
    });

  return c.json(updated[0]);
});

// DELETE /reminders/:id
remindersRoute.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const reminderId = Number(id);

  const deleted = await db
    .delete(reminders)
    .where(eq(reminders.id, reminderId))
    .returning({
      id: reminders.id,
      title: reminders.title,
      message: reminders.message,
      remindAt: reminders.remindAt,
      sendByEmail: reminders.sendByEmail,
      emailRecipient: reminders.emailRecipient,
      sendByWhatsapp: reminders.sendByWhatsapp,
      whatsappRecipient: reminders.whatsappRecipient,
    });

  if (deleted.length === 0) {
    return c.json({ error: "Reminder not found." }, 404);
  }

  return c.json({
    message: "Reminder deleted.",
    reminder: deleted,
  });
});

export default remindersRoute;
