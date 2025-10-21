CREATE TABLE `customers` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`logFeeDiscount` varchar(10) DEFAULT '0',
	`customerType` varchar(50) DEFAULT 'retail',
	`active` enum('yes','no') NOT NULL DEFAULT 'yes',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricingAudit` (
	`id` varchar(64) NOT NULL,
	`productId` varchar(64) NOT NULL,
	`customerId` varchar(64),
	`basePrice` varchar(20) NOT NULL,
	`productDiscount` varchar(10) NOT NULL,
	`logFeeDiscount` varchar(10),
	`finalPrice` varchar(20) NOT NULL,
	`calculatedBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `pricingAudit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`barcode` varchar(100),
	`basePrice` varchar(20) NOT NULL,
	`productDiscount` varchar(10) DEFAULT '0',
	`bonusPattern` varchar(50),
	`category` varchar(100),
	`active` enum('yes','no') NOT NULL DEFAULT 'yes',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
