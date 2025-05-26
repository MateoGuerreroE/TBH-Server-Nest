CREATE TABLE "categories" (
	"categoryId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"categoryName" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null,
	"isEnabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "categories_categoryName_unique" UNIQUE("categoryName")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"productId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"productCup" varchar(100) NOT NULL,
	"productName" varchar(255) NOT NULL,
	"productDescription" text NOT NULL,
	"productPrice" numeric(10, 2) NOT NULL,
	"productEan" varchar(20) DEFAULT null,
	"productImages" text[] DEFAULT '{}',
	"productVideos" text[] DEFAULT '{}',
	"isEnabled" boolean DEFAULT true NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null,
	"subCategoryId" uuid NOT NULL,
	CONSTRAINT "products_productCup_unique" UNIQUE("productCup")
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"subCategoryId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subCategoryName" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT null,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "subcategories_subCategoryName_unique" UNIQUE("subCategoryName")
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_subcategories_subCategoryId_fk" FOREIGN KEY ("subCategoryId") REFERENCES "public"."subcategories"("subCategoryId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_categoryId_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("categoryId") ON DELETE cascade ON UPDATE no action;