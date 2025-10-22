ALTER TABLE "customers" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "primary_contact_name" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "primary_contact_phone" varchar(50);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "primary_contact_email" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "accounts_contact_name" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "accounts_contact_phone" varchar(50);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "accounts_contact_email" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "account_manager" varchar(255);--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "credit_limit" numeric(10, 2) DEFAULT '50000.00';--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "current_balance" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "payment_due_date" timestamp;