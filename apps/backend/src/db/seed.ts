// Install dependencies first:
// bun add @faker-js/faker bcrypt
// bun add -d @types/bcrypt

import { db } from "./index";
import { users, reminders } from "./schema";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

async function seedDataBase() {
  console.log("🌱 Starting seed with fake data...");

  try {
    // Clear existing data
    await db.delete(reminders);
    await db.delete(users);

    // Create multiple fake users
    const numberToCreate = 500;
    const usersToCreate = await Promise.all(
      Array.from({ length: numberToCreate }, async () => {
        return {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: await bcrypt.hash(faker.internet.password(), 10)
        };
      })
    );

    const insertedUsers = await db.insert(users).values(usersToCreate).returning();
    console.log(`✅ ${insertedUsers.length} fake users created`);

    // Create fake reminders for each user
    const remindersToCreate = [];

    for (const user of insertedUsers) {
      // Create between 1 and 5 reminders per user
      const reminderCount = faker.number.int({ min: 1, max: 5 });

      const userReminders = Array.from({ length: reminderCount }, () => {
        const sendByEmail = faker.datatype.boolean();
        const sendByWhatsapp = faker.datatype.boolean();

        return {
          userId: user.id,
          title: faker.lorem.sentence({ min: 2, max: 6 }),
          message: faker.lorem.paragraph({ min: 1, max: 3 }),
          remindAt: faker.date.future({ years: 1 }),
          sendByEmail,
          emailRecipient: sendByEmail ? user.email : "",
          sendByWhatsapp,
          whatsappRecipient: sendByWhatsapp ? faker.phone.number() : "",
          sent: faker.datatype.boolean({ probability: 0.3 }),
          createdAt: faker.date.past({ years: 1 }),
        };
      });

      remindersToCreate.push(...userReminders);
    }

    const insertedReminders = await db.insert(reminders).values(remindersToCreate).returning();
    console.log(`✅ ${insertedReminders.length} fake reminders created`);
    
    console.log('🎉 Fake data seed completed successfully!');

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  }
}

// Execute the seed
await seedDataBase();