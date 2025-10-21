CREATE TYPE "public"."orderStatus" AS ENUM('draft', 'submitted', 'confirmed', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TABLE "orderItems" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"orderId" varchar(64) NOT NULL,
	"productId" varchar(64) NOT NULL,
	"productName" text NOT NULL,
	"quantity" integer NOT NULL,
	"basePrice" numeric(10, 2) NOT NULL,
	"productDiscount" numeric(5, 2) NOT NULL,
	"logFeeDiscount" numeric(5, 2) NOT NULL,
	"unitPrice" numeric(10, 2) NOT NULL,
	"lineTotal" numeric(10, 2) NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"orderNumber" varchar(50) NOT NULL,
	"customerId" varchar(64) NOT NULL,
	"customerName" text NOT NULL,
	"status" "orderStatus" DEFAULT 'draft' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"totalDiscount" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "creditLimit" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "currentBalance" numeric(10, 2) DEFAULT '0';