CREATE TABLE "trends" (
	"trendId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"productId" uuid NOT NULL,
	"isVisibleOnGrid" boolean DEFAULT false NOT NULL,
	"isVisibleOnCarousel" boolean DEFAULT false NOT NULL,
	"trendDiscount" numeric(5, 2) DEFAULT null,
	"addedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" uuid
);
--> statement-breakpoint
ALTER TABLE "trends" ADD CONSTRAINT "trends_productId_products_productId_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("productId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trends" ADD CONSTRAINT "trends_createdBy_admins_adminId_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;