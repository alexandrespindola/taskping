import { db } from "./index";
import { users, reminders } from "./schema";
import bcrypt from "bcrypt";

async function seedManual() {
  console.log("🌱 Starting manual seed...");

  try {
    // Clear existing data (optional)
    await db.delete(reminders);
    await db.delete(users);

    // Create a user manually
    const passwordHash = await bcrypt.hash("senha123", 10);
    const insertedUser = await db
      .insert(users)
      .values({
        name: "Alexandre Spindola",
        email: "alexandre.spindola11@gmail.com",
        password: passwordHash,
        createdAt: new Date(),
      })
      .returning();

    const userId = insertedUser[0].id;

    // Create 1 reminder manually for the created user
    await db.insert(reminders).values({
      userId,
      title: "Manual reminder",
      message: "This is a manually created reminder.",
      remindAt: new Date(Date.now() + 86400000), // 1 day from now
      sendByEmail: true,
      emailRecipient: "alexandre.spindola11@gmail.com",
      sendByWhatsapp: false,
      whatsappRecipient: "",
      sent: false,
      createdAt: new Date(),
    });

    console.log("✅ Manual user and reminder created successfully!");
  } catch (error) {
    console.error("❌ Error creating manual seed:", error);
    throw error;
  }
}

// Execute the seed
await seedManual();
