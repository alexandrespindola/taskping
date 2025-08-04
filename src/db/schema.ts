import { pgTable, serial, uuid, varchar, text, timestamp, boolean as pgBoolean } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255} ).notNull(),
    email: varchar('email', { length: 255} ).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})

// Reminders table
export const reminders = pgTable('reminders', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message'),
    remindAt: timestamp('remind_at').notNull(),
    sendByEmail: pgBoolean('send_by_email').default(false),
    emailRecipient: varchar('email_recipient', { length: 255} ),
    sendByWhatsapp: pgBoolean('send_by_whatsapp').default(false),
    whatsappRecipient: varchar('whatsapp_recipient', { length: 100} ),
    sent: pgBoolean('sent').default(false),
    createdAt: timestamp('created_at').defaultNow()
})