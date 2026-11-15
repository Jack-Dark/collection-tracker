CREATE TABLE "accounts" (
	"access_token" text,
	"access_token_expires_at" timestamp,
	"account_id" text NOT NULL,
	"id" text PRIMARY KEY,
	"id_token" text,
	"password" text,
	"provider_id" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_items" (
	"collection_id" serial,
	"edition_details" text DEFAULT '' NOT NULL,
	"id" serial PRIMARY KEY,
	"images" json DEFAULT '[]' NOT NULL,
	"is_special_edition" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_items_to_custom_field_values" (
	"collection_item_id" integer,
	"custom_field_value_id" integer,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collection_items_to_custom_field_values_pkey" PRIMARY KEY("collection_item_id","custom_field_value_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collections_to_custom_fields" (
	"collection_id" integer,
	"custom_field_id" integer,
	"order" integer DEFAULT 0 NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collections_to_custom_fields_pkey" PRIMARY KEY("collection_id","custom_field_id")
);
--> statement-breakpoint
CREATE TABLE "custom_field_values" (
	"custom_field_id" integer NOT NULL,
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"value_boolean" boolean,
	"value_number" numeric,
	"value_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_fields" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"expires_at" timestamp NOT NULL,
	"id" text PRIMARY KEY,
	"impersonated_by" text,
	"ip_address" text,
	"token" text NOT NULL CONSTRAINT "sessions_token_unique" UNIQUE,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"ban_expires" timestamp,
	"banned" boolean,
	"ban_reason" text,
	"email" text NOT NULL CONSTRAINT "users_email_unique" UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"id" text PRIMARY KEY,
	"image" text,
	"max_collection_items" integer DEFAULT 250 NOT NULL,
	"max_collections" integer DEFAULT 20 NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"expires_at" timestamp NOT NULL,
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collection_id_collections_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ADD CONSTRAINT "collection_items_to_custom_field_values_BhloB1uTCQIO_fkey" FOREIGN KEY ("collection_item_id") REFERENCES "collection_items"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ADD CONSTRAINT "collection_items_to_custom_field_values_MhfYAFHJHSDA_fkey" FOREIGN KEY ("custom_field_value_id") REFERENCES "custom_field_values"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ADD CONSTRAINT "collection_items_to_custom_field_values_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD CONSTRAINT "collections_to_custom_fields_collection_id_collections_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD CONSTRAINT "collections_to_custom_fields_NekodAvTyA0g_fkey" FOREIGN KEY ("custom_field_id") REFERENCES "custom_fields"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD CONSTRAINT "collections_to_custom_fields_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_custom_field_id_custom_fields_id_fkey" FOREIGN KEY ("custom_field_id") REFERENCES "custom_fields"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;