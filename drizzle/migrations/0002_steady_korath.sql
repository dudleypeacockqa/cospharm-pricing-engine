CREATE TYPE "public"."promotionType" AS ENUM('percentage', 'fixed_amount', 'bonus_buy', 'bundle');--> statement-breakpoint
CREATE TABLE "bulkPriceUpdates" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"fileName" varchar(255) NOT NULL,
	"uploadedBy" varchar(64) NOT NULL,
	"recordsProcessed" integer NOT NULL,
	"recordsUpdated" integer NOT NULL,
	"recordsFailed" integer NOT NULL,
	"errorLog" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"promotionType" "promotionType" NOT NULL,
	"discountValue" numeric(10, 2),
	"bonusPattern" varchar(100),
	"productIds" text,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"priority" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "primaryContact" varchar(100);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "accountsContact" varchar(100);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "accountManager" varchar(100);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "paymentTerms" varchar(50) DEFAULT 'Net 30';