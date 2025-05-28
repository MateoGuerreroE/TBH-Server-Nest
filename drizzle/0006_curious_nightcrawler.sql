CREATE TABLE "addresses" (
	"addressId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid DEFAULT null,
	"addressName" varchar(100) NOT NULL,
	"mainAddress" text NOT NULL,
	"notes" text DEFAULT null,
	"city" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_orderId_orders_orderId_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "addressId" uuid DEFAULT null;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_addresses_addressId_fk" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("addressId") ON DELETE set null ON UPDATE no action;