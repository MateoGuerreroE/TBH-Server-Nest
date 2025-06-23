ALTER TABLE "products" ALTER COLUMN "externalId" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "externalId" DROP NOT NULL;