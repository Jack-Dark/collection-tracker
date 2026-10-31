import { createIsomorphicFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import { createAtom, useAtom } from '@tanstack/react-store';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import z from 'zod';

const enableAutoPopulateCustomFieldValuesDefault = true;

const enableAutoPopulateCustomFieldValuesSchema = z
  .union([z.stringbool(), z.boolean()])
  .optional()
  .default(enableAutoPopulateCustomFieldValuesDefault);

const enableAutoPopulateCustomFieldValuesCookieKey =
  '_enable_auto-populate-custom-field-values';

const handleEnableAutoPopulateCustomFieldValuesCookie = createIsomorphicFn()
  .server(() => {
    const cookieValue = getCookie(enableAutoPopulateCustomFieldValuesCookieKey);
    const { data, error, success } =
      enableAutoPopulateCustomFieldValuesSchema.safeParse(cookieValue);

    const setEnableAutoPopulateCustomFieldValuesCookie = (value: boolean) => {
      setCookie(enableAutoPopulateCustomFieldValuesCookieKey, String(value));
    };

    if (success) {
      return {
        enableAutoPopulateCustomFieldValuesCookie: data,
        setEnableAutoPopulateCustomFieldValuesCookie,
      };
    } else {
      console.error(error);

      return {
        enableAutoPopulateCustomFieldValuesCookie:
          enableAutoPopulateCustomFieldValuesDefault,
        setEnableAutoPopulateCustomFieldValuesCookie,
      };
    }
  })
  .client(() => {
    const cookieValue = Cookies.get(
      enableAutoPopulateCustomFieldValuesCookieKey,
    );
    const { data, error, success } =
      enableAutoPopulateCustomFieldValuesSchema.safeParse(cookieValue);

    const setEnableAutoPopulateCustomFieldValuesCookie = (value: boolean) => {
      Cookies.set(enableAutoPopulateCustomFieldValuesCookieKey, String(value));
    };

    if (success) {
      return {
        enableAutoPopulateCustomFieldValuesCookie: data,
        setEnableAutoPopulateCustomFieldValuesCookie,
      };
    } else {
      console.error(error);

      return {
        enableAutoPopulateCustomFieldValuesCookie:
          enableAutoPopulateCustomFieldValuesDefault,
        setEnableAutoPopulateCustomFieldValuesCookie,
      };
    }
  });

const enableAutoPopulateCustomFieldValuesAtom = createAtom<boolean>(
  enableAutoPopulateCustomFieldValuesDefault,
);

export const useEnableAutoPopulateCustomFieldValues = () => {
  const {
    enableAutoPopulateCustomFieldValuesCookie,
    setEnableAutoPopulateCustomFieldValuesCookie,
  } = handleEnableAutoPopulateCustomFieldValuesCookie();

  const [
    enableAutoPopulateCustomFieldValues,
    setEnableAutoPopulateCustomFieldValues,
  ] = useAtom(enableAutoPopulateCustomFieldValuesAtom);

  const handleSetEnableAutoPopulateCustomFieldValues = (value: boolean) => {
    setEnableAutoPopulateCustomFieldValuesCookie(value);
    setEnableAutoPopulateCustomFieldValues(value);
  };

  useEffect(() => {
    setEnableAutoPopulateCustomFieldValues(
      enableAutoPopulateCustomFieldValuesCookie,
    );
  }, []);

  return {
    enableAutoPopulateCustomFieldValues,
    setEnableAutoPopulateCustomFieldValues:
      handleSetEnableAutoPopulateCustomFieldValues,
  };
};
