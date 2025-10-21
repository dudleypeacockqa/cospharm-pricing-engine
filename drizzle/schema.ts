import { pgEnum, pgTable, text, timestamp, varchar, decimal, integer } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const activeEnum = pgEnum("active", ["yes", "no"]);

export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Products table
export const products = pgTable("products", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  barcode: varchar("barcode", { length: 100 }),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  productDiscount: decimal("productDiscount", { precision: 5, scale: 2 }).default("0"),
  bonusPattern: varchar("bonusPattern", { length: 50 }), // e.g., "1@40%"
  category: varchar("category", { length: 100 }),
  active: activeEnum("active").default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Customers table
export const customers = pgTable("customers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  logFeeDiscount: decimal("logFeeDiscount", { precision: 5, scale: 2 }).default("0"),
  customerType: varchar("customerType", { length: 50 }).default("retail"),
  active: activeEnum("active").default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// Pricing calculations audit log
export const pricingAudit = pgTable("pricingAudit", {
  id: varchar("id", { length: 64 }).primaryKey(),
  productId: varchar("productId", { length: 64 }).notNull(),
  customerId: varchar("customerId", { length: 64 }),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  productDiscount: decimal("productDiscount", { precision: 5, scale: 2 }).notNull(),
  logFeeDiscount: decimal("logFeeDiscount", { precision: 5, scale: 2 }),
  finalPrice: decimal("finalPrice", { precision: 10, scale: 2 }).notNull(),
  calculatedBy: varchar("calculatedBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type PricingAudit = typeof pricingAudit.$inferSelect;
export type InsertPricingAudit = typeof pricingAudit.$inferInsert;

