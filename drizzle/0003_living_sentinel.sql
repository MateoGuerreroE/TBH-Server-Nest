CREATE TABLE "coupons" (
	"couponId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"couponCode" varchar(100) NOT NULL,
	"discountAmount" numeric(10, 2) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_couponCode_unique" UNIQUE("couponCode")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"paymentId" uuid PRIMARY KEY NOT NULL,
	"paymentDate" timestamp DEFAULT null,
	"paymentAmount" numeric(10, 2) NOT NULL,
	"userId" uuid NOT NULL,
	"externalPaymentId" varchar(255) DEFAULT null,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"idempotencyKey" varchar(255) NOT NULL,
	"receipt" jsonb DEFAULT 'null'::jsonb,
	"status" varchar(50) DEFAULT 'pending',
	"externalResponse" jsonb DEFAULT 'null'::jsonb,
	"couponId" uuid DEFAULT null,
	CONSTRAINT "payments_idempotencyKey_unique" UNIQUE("idempotencyKey")
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_couponId_coupons_couponId_fk" FOREIGN KEY ("couponId") REFERENCES "public"."coupons"("couponId") ON DELETE no action ON UPDATE no action;