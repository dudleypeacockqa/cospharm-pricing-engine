CREATE TYPE "public"."active" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(320),
	"phone" varchar(50),
	"logFeeDiscount" numeric(5, 2) DEFAULT '0',
	"customerType" varchar(50) DEFAULT 'retail',
	"active" "active" DEFAULT 'yes' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricingAudit" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"productId" varchar(64) NOT NULL,
	"customerId" varchar(64),
	"basePrice" numeric(10, 2) NOT NULL,
	"productDiscount" numeric(5, 2) NOT NULL,
	"logFeeDiscount" numeric(5, 2),
	"finalPrice" numeric(10, 2) NOT NULL,
	"calculatedBy" varchar(64),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"barcode" varchar(100),
	"basePrice" numeric(10, 2) NOT NULL,
	"productDiscount" numeric(5, 2) DEFAULT '0',
	"bonusPattern" varchar(50),
	"category" varchar(100),
	"active" "active" DEFAULT 'yes' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"lastSignedIn" timestamp DEFAULT now()
);
