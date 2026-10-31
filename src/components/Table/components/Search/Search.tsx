import ClearIcon from '@mui/icons-material/Clear';
import NotesIcon from '@mui/icons-material/Notes';
import SearchIcon from '@mui/icons-material/Search';
import { useAppHotkeys, useHotkeys } from '@tanstack/react-hotkeys';
import { useLayoutEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';

import { Button } from '#/components/Button';
import { InputField } from '#/components/Fields/InputField';
import { Popover } from '#/components/Popover';

import type { SearchPropsDef } from './Search.types';

export const Search = (props: SearchPropsDef) => {
  const {
    enableSearchNotes,
    onChange,
    onClickSearchNotes,
    searchNotes,
    value,
  } = props;

  const [query, setQuery] = useState(value);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    setQuery(value);
    onChange(value);
  };

  useLayoutEffect(() => {
    setQuery(value);
  }, [value]);

  const appHotkeys = useAppHotkeys();

  useHotkeys([
    {
      callback: async () => {
        await inputRef.current?.focus();
      },
      hotkey: appHotkeys['app.search'],
    },
  ]);

  return (
    <div className="relative">
      <div className="absolute w-10 left-0 h-full flex justify-center items-center">
        {query ? (
          <Button
            aria-label="Search"
            className="size-full text-inherit hover:text-theme-link-hover"
            Icon={ClearIcon}
            onClick={() => {
              inputRef.current?.focus();

              handleChange('');
            }}
            size="xs"
            variant="ghost"
          />
        ) : (
          <SearchIcon />
        )}
      </div>

      {enableSearchNotes && (
        <div className="absolute right-0 h-full flex items-stretch">
          <Popover
            aria-label='Search "Notes"'
            Description='Search "Notes"'
            Trigger={() => {
              return (
                <div
                  className={twJoin(
                    'px-2 h-full flex items-center cursor-pointer',
                    searchNotes ? 'text-theme-link' : 'text-theme-t1',
                    'hover:text-theme-link-hover',
                  )}
                  onClick={() => {
                    onClickSearchNotes(!searchNotes);
                  }}
                >
                  <NotesIcon />
                </div>
              );
            }}
          />
        </div>
      )}

      <InputField
        className="size-full"
        inputClassName="size-full pl-10 pr-12"
        onValueChange={handleChange}
        placeholder="Search..."
        ref={inputRef}
        type="text"
        value={query}
      />
    </div>
  );
};
