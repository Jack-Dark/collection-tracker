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

const createMutationKeys = <TSuffix extends string>(suffix: TSuffix) => {
  return {
    create: `create-${suffix}`,
    delete: `delete-${suffix}`,
    update: `update-${suffix}`,
  } as const;
};

export const reactMutationKeys = {
  collectionItems: createMutationKeys('collection-items'),
  collections: createMutationKeys('collections'),
  customFields: createMutationKeys('custom-fields'),
  customFieldValues: {
    ...createMutationKeys('custom-field-values'),
    unused: createMutationKeys('unused-custom-field-values'),
  },
  users: {
    ...createMutationKeys('user'),
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
  },
} as const;
