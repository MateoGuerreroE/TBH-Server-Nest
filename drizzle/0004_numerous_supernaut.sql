CREATE TABLE "order_items" (
	"orderItemId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"priceAtPurchase" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"orderId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderDate" timestamp DEFAULT now() NOT NULL,
	"orderTotal" numeric(10, 2) NOT NULL,
	"paymentId" uuid DEFAULT null,
	"userId" uuid DEFAULT null,
	"couponId" uuid DEFAULT null
);
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_idempotencyKey_unique";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_users_userId_fk";
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_couponId_coupons_couponId_fk";
--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "paymentId" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "paymentDate" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "externalPaymentId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "externalPaymentId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "externalResponse" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "externalResponse" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "orderId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_orderId_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("orderId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_productId_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("productId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentId_payments_paymentId_fk" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("paymentId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_couponId_coupons_couponId_fk" FOREIGN KEY ("couponId") REFERENCES "public"."coupons"("couponId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_orders_orderId_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("orderId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "idempotencyKey";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "receipt";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "couponId";