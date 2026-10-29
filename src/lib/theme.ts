import { createIsomorphicFn, createClientOnlyFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import Cookies from 'js-cookie';
import * as z from 'zod';

export const userPreferenceThemes = {
  dark: 'dark',
  light: 'light',
} as const;

const userThemeSchema = z
  .union([
    z.literal(userPreferenceThemes.light),
    z.literal(userPreferenceThemes.dark),
  ])
  .optional();

export type UserPreferencesThemeDef = z.output<typeof userThemeSchema>;

export const userThemeCookieKey = '_theme-preference';

export const themeAttr = 'data-theme';

export const getSystemTheme = createClientOnlyFn(() => {
  const systemPrefersDarkMode = window?.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  const systemTheme: UserPreferencesThemeDef = systemPrefersDarkMode
    ? userPreferenceThemes.dark
    : userPreferenceThemes.light;

  return systemTheme;
});

export const handleThemeCookie = createIsomorphicFn()
  .server(() => {
    const cookieValue = getCookie(userThemeCookieKey);
    const { data, error, success } = userThemeSchema.safeParse(cookieValue);

    const setThemeCookie = (value: UserPreferencesThemeDef) => {
      setCookie(userThemeCookieKey, value ?? '');
    };

    if (success) {
      return {
        setThemeCookie,
        themeCookie: data,
      };
    } else {
      console.error('Theme error:', error);

      return {
        setThemeCookie,
        themeCookie: undefined,
      };
    }
  })
  .client(() => {
    const cookieValue = Cookies.get(userThemeCookieKey);
    const { data, error, success } = userThemeSchema.safeParse(cookieValue);

    const setThemeCookie = (value: UserPreferencesThemeDef) => {
      Cookies.set(userThemeCookieKey, value ?? '');
    };

    if (success) {
      return {
        setThemeCookie,
        themeCookie: data,
      };
    } else {
      console.error('Theme error:', error);

      return {
        setThemeCookie,
        themeCookie: getSystemTheme(),
      };
    }
  });
