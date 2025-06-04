ALTER TABLE "products" ALTER COLUMN "productImages" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "productVideos" SET DEFAULT '[]'::json;