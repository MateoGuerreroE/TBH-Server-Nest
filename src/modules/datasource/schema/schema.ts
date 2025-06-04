import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  numeric,
  jsonb,
  json,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ImageType, VideoType } from '../types';

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

export const userRelations = relations(userTable, ({ one, many }) => ({
  deletedByAdmin: one(adminTable, {
    fields: [userTable.deletedBy],
    references: [adminTable.adminId],
  }),
  addresses: many(addressTable),
}));

// Product
export const productTable = pgTable('products', {
  productId: uuid().primaryKey().defaultRandom(),
  productName: varchar({ length: 255 }).notNull(),
  productPrice: numeric({ precision: 10, scale: 2 }).notNull(),
  productTags: text().array().default([]),
  discount: numeric({ precision: 5, scale: 2 }).default('0'),
  stock: integer().notNull().default(0),
  externalId: varchar({ length: 100 }).notNull().unique(),
  productImages: json()
    .$type<
      Array<{
        url: string;
        isPrimary: boolean;
        altText?: string;
        type: ImageType;
        color: string;
      }>
    >()
    .default([]),
  productDescription: json().$type<{
    short: string;
    content: string;
  }>(),
  productVideos: json()
    .$type<
      Array<{
        url: string;
        videoType: VideoType;
      }>
    >()
    .default([]),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }).default(null),
  createdBy: uuid().notNull(),
  updatedBy: uuid().notNull(),
  deletedBy: uuid().default(null),

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

// Payment
export const orderTable = pgTable('orders', {
  orderId: uuid().primaryKey().defaultRandom(),
  orderDate: timestamp({ mode: 'date' }).notNull().defaultNow(),
  orderProductTotal: numeric({ precision: 10, scale: 2 }).notNull(),
  taxes: numeric({ precision: 10, scale: 2 }).notNull(),
  addressId: uuid()
    .default(null)
    .references(() => addressTable.addressId, { onDelete: 'set null' }),
  paymentId: uuid()
    .default(null)
    .references(() => paymentTable.paymentId, {
      onDelete: 'cascade',
    }),
  userId: uuid()
    .default(null)
    .references(() => userTable.userId, {
      onDelete: 'cascade',
    }),
  couponId: uuid()
    .default(null)
    .references(() => couponTable.couponId, {
      onDelete: 'set null',
    }),
});

export const orderItemTable = pgTable('order_items', {
  orderItemId: uuid().primaryKey().defaultRandom(),
  orderId: uuid()
    .notNull()
    .references(() => orderTable.orderId, {
      onDelete: 'cascade',
    }),
  productId: uuid()
    .notNull()
    .references(() => productTable.productId, {
      onDelete: 'cascade',
    }),
  amount: numeric().notNull(),
  priceAtPurchase: numeric({ precision: 10, scale: 2 }).notNull(),
});

export const orderRelations = relations(orderTable, ({ one, many }) => ({
  items: many(orderItemTable),
  coupon: one(couponTable, {
    fields: [orderTable.couponId],
    references: [couponTable.couponId],
  }),
  payment: one(paymentTable, {
    fields: [orderTable.paymentId],
    references: [paymentTable.paymentId],
  }),
  user: one(userTable, {
    fields: [orderTable.userId],
    references: [userTable.userId],
  }),
  address: one(addressTable, {
    fields: [orderTable.addressId],
    references: [addressTable.addressId],
  }),
}));

export const orderItemRelations = relations(orderItemTable, ({ one }) => ({
  order: one(orderTable, {
    fields: [orderItemTable.orderId],
    references: [orderTable.orderId],
  }),
  product: one(productTable, {
    fields: [orderItemTable.productId],
    references: [productTable.productId],
  }),
}));

export const paymentTable = pgTable('payments', {
  paymentId: uuid().primaryKey().defaultRandom(),
  paymentDate: timestamp({ mode: 'date' }).defaultNow(),
  paymentAmount: numeric({ precision: 10, scale: 2 }).notNull(),
  externalPaymentId: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  orderId: uuid('orderId').notNull(),
  status: varchar({ length: 15 }).notNull(),
  externalResponse: jsonb().notNull(),
});

export const paymentRelations = relations(paymentTable, ({ one }) => ({
  order: one(orderTable, {
    fields: [paymentTable.orderId],
    references: [orderTable.orderId],
  }),
}));

export const couponTable = pgTable('coupons', {
  couponId: uuid().primaryKey().defaultRandom(),
  couponCode: varchar({ length: 100 }).notNull().unique(),
  discountAmount: numeric({ precision: 10, scale: 2 }).notNull(),
  expiresAt: timestamp({ mode: 'date' }).notNull(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
});

export const couponRelations = relations(couponTable, ({ many }) => ({
  orders: many(orderTable),
}));

export const addressTable = pgTable('addresses', {
  addressId: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .default(null)
    .references(() => userTable.userId, {}),
  addressName: varchar({ length: 100 }).notNull(),
  mainAddress: text().notNull(),
  notes: text().default(null),
  city: varchar({ length: 100 }).notNull(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  deletedAt: timestamp({ mode: 'date' }).default(null),
});

export const addressRelations = relations(addressTable, ({ one, many }) => ({
  orders: many(orderTable),
  user: one(userTable, {
    fields: [addressTable.userId],
    references: [userTable.userId],
  }),
}));
