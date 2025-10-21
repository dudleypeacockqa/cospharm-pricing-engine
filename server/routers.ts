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

  // Orders router
  orders: router({
    getByCustomer: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const { getOrdersByCustomer } = await import("./db");
        return getOrdersByCustomer(input);
      }),
    create: publicProcedure
      .input(
        z.object({
          customerId: z.string(),
          productId: z.string(),
          quantity: z.number(),
          unitPrice: z.string(),
          totalAmount: z.string(),
          status: z.string().default("pending"),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createOrder } = await import("./db");
        const { randomUUID } = await import("crypto");
        await createOrder({
          id: randomUUID(),
          ...input,
        });
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

  // Promotions router
  promotions: router({
    list: publicProcedure.query(async () => {
      const { getPromotions } = await import("./db");
      return getPromotions();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().nullable(),
        promotionType: z.string(),
        discountValue: z.number().nullable(),
        bonusPattern: z.string().nullable(),
        startDate: z.date(),
        endDate: z.date(),
        active: z.boolean(),
        priority: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { createPromotion } = await import("./db");
        const { randomUUID } = await import("crypto");
        return createPromotion({
          id: randomUUID(),
          name: input.name,
          description: input.description,
          promotionType: input.promotionType,
          discountValue: input.discountValue ? input.discountValue.toString() : null,
          bonusPattern: input.bonusPattern,
          startDate: input.startDate,
          endDate: input.endDate,
          active: input.active,
          priority: input.priority,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { deletePromotion } = await import("./db");
        return deletePromotion(input.id);
      }),
  }),

  // Bulk upload router
  bulkUpload: router({
    history: publicProcedure.query(async () => {
      const { getBulkPriceUpdates } = await import("./db");
      return getBulkPriceUpdates();
    }),
    process: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileContent: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createBulkPriceUpdate, updateProduct, getProduct } = await import("./db");
        const { randomUUID } = await import("crypto");
        
        let recordsProcessed = 0;
        let recordsUpdated = 0;
        let recordsFailed = 0;
        const errors: string[] = [];

        try {
          // Parse CSV content
          const lines = input.fileContent.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          
          // Validate headers
          const requiredHeaders = ['Product ID', 'Base Price'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
          }

          // Process each row
          for (let i = 1; i < lines.length; i++) {
            recordsProcessed++;
            try {
              const values = lines[i].split(',').map(v => v.trim());
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index];
              });

              const productId = row['Product ID'];
              if (!productId) {
                errors.push(`Row ${i + 1}: Missing Product ID`);
                recordsFailed++;
                continue;
              }

              // Check if product exists
              const product = await getProduct(productId);
              if (!product) {
                errors.push(`Row ${i + 1}: Product ${productId} not found`);
                recordsFailed++;
                continue;
              }

              // Update product
              const updates: any = {};
              if (row['Base Price']) {
                const basePrice = parseFloat(row['Base Price']);
                if (isNaN(basePrice)) {
                  errors.push(`Row ${i + 1}: Invalid Base Price`);
                  recordsFailed++;
                  continue;
                }
                updates.basePrice = basePrice.toString();
              }
              if (row['Product Discount']) {
                const discount = parseFloat(row['Product Discount']);
                if (!isNaN(discount)) {
                  updates.productDiscount = discount.toString();
                }
              }
              if (row['Bonus Pattern']) {
                updates.bonusPattern = row['Bonus Pattern'];
              }

              await updateProduct(productId, updates);
              recordsUpdated++;
            } catch (error: any) {
              errors.push(`Row ${i + 1}: ${error.message}`);
              recordsFailed++;
            }
          }

          // Log the bulk update
          await createBulkPriceUpdate({
            id: randomUUID(),
            fileName: input.fileName,
            uploadedBy: ctx.user?.id || 'unknown',
            recordsProcessed,
            recordsUpdated,
            recordsFailed,
            errorLog: errors.length > 0 ? errors.join('\n') : null,
          });

          return {
            success: true,
            recordsProcessed,
            recordsUpdated,
            recordsFailed,
            errors,
          };
        } catch (error: any) {
          throw new Error(`Bulk upload failed: ${error.message}`);
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;



