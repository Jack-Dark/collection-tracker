export const reactQueryKeys = {
  getCollectionDetailsById: 'get-collection-details',
  getCollectionItemsWithCustomFieldValue:
    'get-collection-items-with-custom-field-value',
  getCustomFields: 'get-custom-fields',
  getCustomFieldValuesByCustomFieldId:
    'get-custom-field-values-by-custom-field-id',
  getFiltersForCollection: 'get-filters-for-collection',
  getNavMenuCollections: 'get-nav-menu-collections',
  getNumCollectionsWithCustomField: 'get-num-collections-with-custom-field',
  getPaginatedCollections: 'get-paginated-collections',
  getPaginatedUsers: 'get-paginated-users',
} as const;

export const reactMutationKeys = {
  collectionItems: (type: MutationKeyType) => {
    return `${type}-collection-items` as const;
  },
  collections: (type: MutationKeyType) => {
    return `${type}-collections` as const;
  },
  /** @deprecated */
  createCollectionItems: 'create-collection-items',
  /** @deprecated */
  createCollections: 'create-collections',
  /** @deprecated */
  createCustomFields: 'create-custom-fields',
  customFields: (type: MutationKeyType) => {
    return `${type}-custom-fields` as const;
  },
  customFieldValues: (type: MutationKeyType) => {
    return `${type}-custom-field-values` as const;
  },
  /** @deprecated */
  deleteCollectionItems: 'delete-collection-items',
  /** @deprecated */
  deleteCollections: 'delete-collections',
  /** @deprecated */
  deleteCustomFields: 'delete-custom-field',
  /** @deprecated */
  updateCollectionItems: 'update-collection-items',
  /** @deprecated */
  updateCollections: 'update-collections',
  /** @deprecated */
  updateCustomFields: 'update-custom-fields',
  users: {
    delete: 'delete-user',
    email: {
      update: 'update-email',
    },
    impersonate: 'impersonate-user',
    impersonateStop: 'stop-impersonating-user',
    password: {
      requestReset: 'request-password-reset',
      reset: 'reset-password',
      update: 'update-password',
    },
    requestVerificationEmail: 'request-verification-email',
    signIn: {
      viaEmail: 'sign-in-via-email',
    },
    signOut: 'sign-out',
    signUp: {
      viaEmail: 'sign-up-via-email',
    },
    update: 'update-user',
  },
} as const;

type BaseMutationKeyType = 'create' | 'delete' | 'update';

type MutationKeyType = BaseMutationKeyType | `${BaseMutationKeyType}-${string}`;
