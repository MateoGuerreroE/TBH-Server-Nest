import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  numeric,
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

// Product
export const productTable = pgTable('products', {
  productId: uuid().primaryKey().defaultRandom(),
  productCup: varchar({ length: 100 }).notNull().unique(),
  productName: varchar({ length: 255 }).notNull(),
  productDescription: text().notNull(),
  productPrice: numeric({ precision: 10, scale: 2 }).notNull(),
  productEan: varchar({ length: 20 }).default(null),
  productImages: text().array().default([]),
  productVideos: text().array().default([]),
  isEnabled: boolean().notNull().default(true),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }).default(null),

  subCategoryId: uuid('subCategoryId')
    .references(() => subcategoryTable.subCategoryId, { onDelete: 'cascade' })
    .notNull(),
});

export const categoryTable = pgTable('categories', {
  categoryId: uuid().primaryKey().defaultRandom(),
  categoryName: varchar({ length: 100 }).notNull().unique(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }).default(null),
  isEnabled: boolean().notNull().default(true),
});

export const subcategoryTable = pgTable('subcategories', {
  subCategoryId: uuid().primaryKey().defaultRandom(),
  subCategoryName: varchar({ length: 100 }).notNull().unique(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }).default(null),
  isEnabled: boolean().notNull().default(true),

  categoryId: uuid('categoryId')
    .references(() => categoryTable.categoryId, { onDelete: 'cascade' })
    .notNull(),
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  subCategories: many(subcategoryTable),
}));

export const subcategoryRelations = relations(
  subcategoryTable,
  ({ one, many }) => ({
    category: one(categoryTable, {
      fields: [subcategoryTable.categoryId],
      references: [categoryTable.categoryId],
    }),
    products: many(productTable),
  }),
);

export const productRelations = relations(productTable, ({ one }) => ({
  subCategory: one(subcategoryTable, {
    fields: [productTable.subCategoryId],
    references: [subcategoryTable.subCategoryId],
  }),
}));
