import { eq, sql, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { InsertUser, users, promotions, InsertPromotion, bulkPriceUpdates, InsertBulkPriceUpdate } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10,
        idleTimeoutMillis: 20000,
        connectionTimeoutMillis: 10000,
      });
      _db = drizzle(_pool);
      console.log("[Database] PostgreSQL connection established");
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _pool = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values)
      .onConflictDoUpdate({
        target: users.id,
        set: updateSet,
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Database] getAllProducts: database not available");
      return [];
    }
    const { products } = await import("../drizzle/schema");
    const result = await db.select().from(products);
    console.log(`[Database] getAllProducts: returned ${result.length} products`);
    return result;
  } catch (error) {
    console.error("[Database] getAllProducts error:", error);
    throw error;
  }
}

export async function getProduct(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const { products } = await import("../drizzle/schema");
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { products } = await import("../drizzle/schema");
  await db.insert(products).values(product);
}

export async function updateProduct(id: string, updates: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { products } = await import("../drizzle/schema");
  await db.update(products).set({ ...updates, updatedAt: new Date() }).where(eq(products.id, id));
}

// Customer queries
export async function getAllCustomers() {
  const db = await getDb();
  if (!db) return [];
  const { customers } = await import("../drizzle/schema");
  // Select only core columns that exist in production
  return db.select({
    id: customers.id,
    name: customers.name,
    email: customers.email,
    phone: customers.phone,
    logFeeDiscount: customers.logFeeDiscount,
    customerType: customers.customerType,
    active: customers.active,
    createdAt: customers.createdAt,
    updatedAt: customers.updatedAt,
  }).from(customers);
}

export async function getCustomer(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const { customers } = await import("../drizzle/schema");
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCustomer(customer: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { customers } = await import("../drizzle/schema");
  await db.insert(customers).values(customer);
}

export async function updateCustomer(id: string, updates: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { customers } = await import("../drizzle/schema");
  await db.update(customers).set({ ...updates, updatedAt: new Date() }).where(eq(customers.id, id));
}

// Pricing audit queries
export async function createPricingAudit(audit: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { pricingAudit } = await import("../drizzle/schema");
  await db.insert(pricingAudit).values(audit);
}

export async function getRecentPricingAudits(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  const { pricingAudit } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  return db.select().from(pricingAudit).orderBy(desc(pricingAudit.createdAt)).limit(limit);
}


// Orders functions
export async function createOrder(order: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { orders } = await import("../drizzle/schema");
  await db.insert(orders).values(order);
}

export async function getOrdersByCustomer(customerId: string) {
  const db = await getDb();
  if (!db) return [];
  const { orders } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  return db.select().from(orders).where(eq(orders.customerId, customerId));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  const { orders } = await import("../drizzle/schema");
  return db.select().from(orders);
}



// Promotions functions

export async function getPromotions() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await db.select().from(promotions).orderBy(desc(promotions.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get promotions:", error);
    return [];
  }
}

export async function getActivePromotions() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const now = new Date();
    const result = await db.select().from(promotions)
      .where(sql`${promotions.active} = true AND ${promotions.startDate} <= ${now} AND ${promotions.endDate} >= ${now}`)
      .orderBy(desc(promotions.priority));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get active promotions:", error);
    return [];
  }
}

export async function createPromotion(promotion: InsertPromotion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const result = await db.insert(promotions).values(promotion).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create promotion:", error);
    throw error;
  }
}

export async function updatePromotion(id: string, updates: Partial<InsertPromotion>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const result = await db.update(promotions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(promotions.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to update promotion:", error);
    throw error;
  }
}

export async function deletePromotion(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    await db.delete(promotions).where(eq(promotions.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete promotion:", error);
    throw error;
  }
}

// Bulk price updates functions
export async function getBulkPriceUpdates() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await db.select().from(bulkPriceUpdates).orderBy(desc(bulkPriceUpdates.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get bulk price updates:", error);
    return [];
  }
}

export async function createBulkPriceUpdate(update: InsertBulkPriceUpdate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const result = await db.insert(bulkPriceUpdates).values(update).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create bulk price update:", error);
    throw error;
  }
}

