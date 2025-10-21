import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

// Seed data router (for demo purposes)
const seedRouter = router({
  populate: publicProcedure.mutation(async () => {
    const { createProduct, createCustomer } = await import("./db");
    const { seedProducts, seedCustomers } = await import("./seed");
    
    try {
      for (const product of seedProducts) {
        await createProduct(product);
      }
      for (const customer of seedCustomers) {
        await createCustomer(customer);
      }
      return { success: true, message: "Demo data populated successfully" };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }),
});

export const appRouter = router({
  system: systemRouter,
  seed: seedRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products router
  products: router({
    list: publicProcedure.query(async () => {
      try {
        const { getAllProducts } = await import("./db");
        const products = await getAllProducts();
        console.log(`[Router] products.list: returning ${products.length} products`);
        return products;
      } catch (error) {
        console.error("[Router] products.list error:", error);
        throw new Error(`Failed query: ${error instanceof Error ? error.message : String(error)}`);
      }
    }),
    get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { getProduct } = await import("./db");
      return getProduct(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          barcode: z.string().optional(),
          basePrice: z.string(),
          productDiscount: z.string().default("0"),
          bonusPattern: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createProduct } = await import("./db");
        const { randomUUID } = await import("crypto");
        await createProduct({
          id: randomUUID(),
          ...input,
          active: "yes",
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          barcode: z.string().optional(),
          basePrice: z.string().optional(),
          productDiscount: z.string().optional(),
          bonusPattern: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { updateProduct } = await import("./db");
        const { id, ...updates } = input;
        await updateProduct(id, updates);
        return { success: true };
      }),
  }),

  // Customers router
  customers: router({
    list: publicProcedure.query(async () => {
      const { getAllCustomers } = await import("./db");
      return getAllCustomers();
    }),
    get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const { getCustomer } = await import("./db");
      return getCustomer(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().optional(),
          phone: z.string().optional(),
          logFeeDiscount: z.string().default("0"),
          customerType: z.string().default("retail"),
        })
      )
      .mutation(async ({ input }) => {
        const { createCustomer } = await import("./db");
        const { randomUUID } = await import("crypto");
        await createCustomer({
          id: randomUUID(),
          ...input,
          active: "yes",
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          logFeeDiscount: z.string().optional(),
          customerType: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { updateCustomer } = await import("./db");
        const { id, ...updates } = input;
        await updateCustomer(id, updates);
        return { success: true };
      }),
  }),

  // Pricing calculator
  pricing: router({
    calculate: publicProcedure
      .input(
        z.object({
          productId: z.string(),
          customerId: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { getProduct, getCustomer, createPricingAudit } = await import("./db");
        const { calculatePrice, parsePrice, parseDiscount, formatPrice } = await import("./pricing");
        const { randomUUID } = await import("crypto");

        const product = await getProduct(input.productId);
        if (!product) throw new Error("Product not found");

        const basePrice = parsePrice(product.basePrice);
        const productDiscount = parseDiscount(product.productDiscount || "0");

        let logFeeDiscount = 0;
        if (input.customerId) {
          const customer = await getCustomer(input.customerId);
          if (customer) {
            logFeeDiscount = parseDiscount(customer.logFeeDiscount || "0");
          }
        }

        const calculation = calculatePrice(basePrice, productDiscount, logFeeDiscount);

        // Log the calculation
        await createPricingAudit({
          id: randomUUID(),
          productId: input.productId,
          customerId: input.customerId,
          basePrice: formatPrice(calculation.basePrice),
          productDiscount: formatPrice(calculation.productDiscount),
          logFeeDiscount: formatPrice(calculation.logFeeDiscount),
          finalPrice: formatPrice(calculation.finalPrice),
          calculatedBy: ctx.user?.id,
        });

        return calculation;
      }),
    auditLog: publicProcedure.query(async () => {
      const { getRecentPricingAudits } = await import("./db");
      return getRecentPricingAudits(50);
    }),
  }),
});

export type AppRouter = typeof appRouter;



