import z from 'zod';

import { createCollectionItemsFormSchema } from '#/api/routes/collection-items/create-collection-item/create-collection-item.schema';
import { updateCollectionItemsFormSchema } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.schema';

export const createOrUpdateCollectionItemsFormSchema = z.object({
  collectionItems: z.array(
    z.union([createCollectionItemsFormSchema, updateCollectionItemsFormSchema]),
  ),
});
