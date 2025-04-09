import { create } from "domain";
import { desc } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  json,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(100),
  phoneNumber: varchar({ length: 255 }),
  country: varchar({ length: 255 }),
});

export const imagetocodeTable = pgTable("imagetocode", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uid: varchar({ length: 255 }).notNull(),
  imageUrl: varchar({ length: 255 }).notNull(),
  code: json("code").notNull(),
  description: varchar({ length: 255 }),
  email: varchar({ length: 255 }),
  createdAt: varchar({ length: 255 }).notNull(),
  options: json().default({}),
  mode: varchar({ length: 255 }).notNull(),
  theme: varchar({ length: 255 }).notNull(),
  language: varchar({ length: 255 }).notNull(),
});

export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  credits: integer().notNull(),
  amount: integer().notNull(),
  paymentId: varchar({ length: 255 }).notNull(),
  orderId: varchar({ length: 255 }).notNull(),
  signature: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uid: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  email: varchar({ length: 255 }),
});
