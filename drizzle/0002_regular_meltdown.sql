ALTER TABLE "subcategories" RENAME COLUMN "category_id" TO "categoryId";--> statement-breakpoint
ALTER TABLE "subcategories" DROP CONSTRAINT "subcategories_category_id_categories_categoryId_fk";
--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_categoryId_categories_categoryId_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("categoryId") ON DELETE cascade ON UPDATE no action;