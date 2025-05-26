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
	"deleted_by" uuid,
	CONSTRAINT "users_emailAddress_unique" UNIQUE("emailAddress")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_deleted_by_admins_adminId_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."admins"("adminId") ON DELETE set null ON UPDATE no action;