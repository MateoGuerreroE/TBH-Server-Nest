CREATE TABLE "addresses" (
	"addressId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid DEFAULT null,
	"addressName" varchar(100) NOT NULL,
	"mainAddress" text NOT NULL,
	"notes" text DEFAULT null,
	"city" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"adminId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"phone" varchar(30) DEFAULT null,
	"isEnabled" boolean DEFAULT false NOT NULL,
	"emailAddress" varchar(255) NOT NULL,
	"firebaseId" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null,
	"lastLoginAt" timestamp DEFAULT null,
	CONSTRAINT "admins_emailAddress_unique" UNIQUE("emailAddress")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"categoryId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"categoryName" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null,
	"createdBy" uuid NOT NULL,
	"updatedBy" uuid NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "categories_categoryName_unique" UNIQUE("categoryName")
);
--> statement-breakpoint
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
CREATE TABLE "discount_campaigns" (
	"discountCampaignId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discountCampaignName" varchar(100) NOT NULL,
	"discountValue" numeric(10, 2) NOT NULL,
	"createdBy" uuid NOT NULL,
	"updatedBy" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null
);
--> statement-breakpoint
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
	"orderProductTotal" numeric(10, 2) NOT NULL,
	"taxes" numeric(10, 2) NOT NULL,
	"addressId" uuid DEFAULT null,
	"paymentId" uuid DEFAULT null,
	"userId" uuid DEFAULT null,
	"couponId" uuid DEFAULT null
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"paymentId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"paymentDate" timestamp DEFAULT now(),
	"paymentAmount" numeric(10, 2) NOT NULL,
	"externalPaymentId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"orderId" uuid NOT NULL,
	"status" varchar(15) NOT NULL,
	"externalResponse" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"productId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"productName" varchar(255) NOT NULL,
	"productPrice" numeric(10, 2) NOT NULL,
	"productTags" text[] DEFAULT '{}',
	"discount" numeric(5, 2) DEFAULT '0',
	"stock" integer DEFAULT 0 NOT NULL,
	"externalId" varchar(100) NOT NULL,
	"productImages" json DEFAULT '[]'::json,
	"productDescription" json,
	"productVideos" json DEFAULT '[]'::json,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null,
	"createdBy" uuid NOT NULL,
	"updatedBy" uuid NOT NULL,
	"discountCampaignId" uuid DEFAULT null,
	"subCategoryId" uuid NOT NULL,
	CONSTRAINT "products_externalId_unique" UNIQUE("externalId")
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"subCategoryId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subCategoryName" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"createdBy" uuid NOT NULL,
	"updatedBy" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	CONSTRAINT "subcategories_subCategoryName_unique" UNIQUE("subCategoryName")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"address" text DEFAULT null,
	"city" varchar(100) DEFAULT null,
	"phone" varchar(30) DEFAULT null,
	"avatarUrl" varchar(255) DEFAULT null,
	"isEmailVerified" boolean DEFAULT false NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"emailAddress" varchar(255) NOT NULL,
	"firebaseId" varchar(255) DEFAULT null,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null,
	"lastLoginAt" timestamp DEFAULT null,
	"updatedBy" uuid,
	CONSTRAINT "users_emailAddress_unique" UNIQUE("emailAddress")
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_createdBy_admins_adminId_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_updatedBy_admins_adminId_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_campaigns" ADD CONSTRAINT "discount_campaigns_createdBy_admins_adminId_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_campaigns" ADD CONSTRAINT "discount_campaigns_updatedBy_admins_adminId_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_orderId_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("orderId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_productId_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("productId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_addresses_addressId_fk" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("addressId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentId_payments_paymentId_fk" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("paymentId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_couponId_coupons_couponId_fk" FOREIGN KEY ("couponId") REFERENCES "public"."coupons"("couponId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_createdBy_admins_adminId_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_updatedBy_admins_adminId_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_discountCampaignId_discount_campaigns_discountCampaignId_fk" FOREIGN KEY ("discountCampaignId") REFERENCES "public"."discount_campaigns"("discountCampaignId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_subcategories_subCategoryId_fk" FOREIGN KEY ("subCategoryId") REFERENCES "public"."subcategories"("subCategoryId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_createdBy_admins_adminId_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_updatedBy_admins_adminId_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_categoryId_categories_categoryId_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("categoryId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_updatedBy_admins_adminId_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;