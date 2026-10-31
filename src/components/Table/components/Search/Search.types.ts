export type SearchPropsDef = {
  onChange: (search: string) => void | Promise<void>;
  value: string;
} & SearchNotesSettingsDef;

type SearchNotesSettingsDef =
  | {
      enableSearchNotes?: never;
      onClickSearchNotes?: never;
      searchNotes?: never;
    }
  | {
      enableSearchNotes?: boolean;
      onClickSearchNotes: (checked: boolean) => void;
      searchNotes: boolean;
    };
