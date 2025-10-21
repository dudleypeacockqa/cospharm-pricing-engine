import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Products table
export const products = mysqlTable("products", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  barcode: varchar("barcode", { length: 100 }),
  basePrice: varchar("basePrice", { length: 20 }).notNull(), // Store as string to avoid decimal precision issues
  productDiscount: varchar("productDiscount", { length: 10 }).default("0"), // Percentage as string
  bonusPattern: varchar("bonusPattern", { length: 50 }), // e.g., "1@40%"
  category: varchar("category", { length: 100 }),
  active: mysqlEnum("active", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Customers table
export const customers = mysqlTable("customers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  logFeeDiscount: varchar("logFeeDiscount", { length: 10 }).default("0"), // Percentage as string
  customerType: varchar("customerType", { length: 50 }).default("retail"),
  active: mysqlEnum("active", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// Pricing calculations audit log
export const pricingAudit = mysqlTable("pricingAudit", {
  id: varchar("id", { length: 64 }).primaryKey(),
  productId: varchar("productId", { length: 64 }).notNull(),
  customerId: varchar("customerId", { length: 64 }),
  basePrice: varchar("basePrice", { length: 20 }).notNull(),
  productDiscount: varchar("productDiscount", { length: 10 }).notNull(),
  logFeeDiscount: varchar("logFeeDiscount", { length: 10 }),
  finalPrice: varchar("finalPrice", { length: 20 }).notNull(),
  calculatedBy: varchar("calculatedBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type PricingAudit = typeof pricingAudit.$inferSelect;
export type InsertPricingAudit = typeof pricingAudit.$inferInsert;
