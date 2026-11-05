import type {
  ComboboxInputProps,
  ComboboxItemIndicator,
  ComboboxRootProps,
} from '@base-ui/react';
import type {
  DependencyList,
  HTMLAttributes,
  JSXElementConstructor,
} from 'react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type TValueRecordDef = {
  [key: string]: any;
  /** DO NOT USE. Added by the system if input can create new items. */
  creatable?: true;
  disabled?: true;
};

export type ComboboxValueDef<
  TValue extends TValueRecordDef,
  TMultiple extends boolean | undefined,
> = TMultiple extends true ? TValue[] : TValue;

export type ComboboxFieldPropsDef<
  TValue extends TValueRecordDef,
  TMultiple extends boolean | undefined = false,
> = ComboboxRootProps<TValue, TMultiple> &
  Pick<ComboboxInputProps, 'autoFocus' | 'placeholder'> &
  FieldWrapperProps & {
    allowCreatable?: boolean;
    ariaLabel?: string;
    caseSensitiveCreation?: boolean;
    caseSensitiveFilter?: boolean;
    createNewItem?: (trimmedQuery: string) => TValue;
    enableChipSort?: boolean;
    hideLabel?: boolean;
    idProperty?: keyof TValue;
    inputValue?: string;
    itemsDependencies?: DependencyList;
    labelProperty?: keyof TValue;
    onChipSort?: (items: TValue[]) => void;
    onRemoveChip?: (item: TValue, index: number) => void;
    RenderChip?: JSXElementConstructor<
      HTMLAttributes<HTMLElement> & { item: TValue }
    >;
    RenderItem?: JSXElementConstructor<
      HTMLAttributes<HTMLElement> & {
        item: TValue;
        multiple: boolean | undefined;
        SelectedIndicator: typeof ComboboxItemIndicator;
      }
    >;
    sortItems?: (items: TValue[]) => TValue[];
    /** Runs if the search query matches an existing item. Allows a second validation to compare more than just the query value. */
    verifyShowNewItem?: (props: {
      itemMatchingQuery: TValue | undefined;
      newItem: TValue;
      normalizedQuery: string;
      query: string;
    }) => boolean;
  };
