ALTER TABLE "collection_items_to_custom_field_values" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ADD PRIMARY KEY ("collection_item_id","custom_field_value_id");--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD PRIMARY KEY ("collection_id","custom_field_id");