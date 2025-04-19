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
  imageUrl: varchar().notNull(),
  code: json("code").notNull(),
  description: varchar(),
  email: varchar({ length: 255 }),
  createdAt: varchar({ length: 255 }).notNull(),
  options: json().default({}),
  mode: varchar({ length: 255 }).notNull(),
  theme: varchar({ length: 255 }).notNull(),
  language: varchar({ length: 255 }).notNull(),
  projectTitle: varchar(),
  explanation: varchar(),

});
export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  credits: integer().notNull(),
  amount: integer().notNull(),
  paymentId: varchar().notNull(),
  orderId: varchar().notNull(),
  signature: varchar().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  uid: varchar().notNull(),
  description: varchar(),
  email: varchar({ length: 255 }),
});
