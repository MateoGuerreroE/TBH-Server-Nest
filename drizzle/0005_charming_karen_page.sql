ALTER TABLE "orders" ADD COLUMN "orderProductTotal" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "taxes" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "orderTotal";