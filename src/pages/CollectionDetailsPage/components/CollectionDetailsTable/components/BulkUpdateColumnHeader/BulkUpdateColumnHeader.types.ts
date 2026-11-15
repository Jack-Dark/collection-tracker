import type { CustomFieldDataForCollectionDef } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.types';
import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

export type BulkUpdateColumnHeaderPropsDef = {
  customField: CustomFieldDataForCollectionDef<number>;
  form: CreateOrUpdateCollectionItemFormTypeDef;
};
