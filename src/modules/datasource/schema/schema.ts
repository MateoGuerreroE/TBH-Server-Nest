import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Access
export const userTable = pgTable('users', {
  userId: uuid().primaryKey().defaultRandom(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }).notNull(),
  address: text().default(null),
  city: varchar({ length: 100 }).default(null),
  phone: varchar({ length: 30 }).default(null),
  avatarUrl: varchar({ length: 255 }).default(null),

  isEmailVerified: boolean().notNull().default(false),
  isEnabled: boolean().notNull().default(true),

  emailAddress: varchar({ length: 255 }).notNull().unique(),
  firebaseId: varchar({ length: 255 }).default(null),

  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }).default(null),

  lastLoginAt: timestamp({ mode: 'date' }).default(null),

  deletedBy: uuid('deleted_by').references(() => adminTable.adminId, {
    onDelete: 'set null',
  }),
});

export const adminTable = pgTable('admins', {
  adminId: uuid().primaryKey().defaultRandom(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }).notNull(),
  phone: varchar({ length: 30 }).default(null),

  isEnabled: boolean().notNull().default(false),

  emailAddress: varchar({ length: 255 }).notNull().unique(),
  firebaseId: varchar({ length: 255 }).notNull(),

  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }).default(null),

  lastLoginAt: timestamp({ mode: 'date' }).default(null),
});

export const userRelations = relations(userTable, ({ one }) => ({
  deletedByAdmin: one(adminTable, {
    fields: [userTable.deletedBy],
    references: [adminTable.adminId],
  }),
}));
