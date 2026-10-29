import type { PropsWithChildren } from 'react';

import { ScriptOnce } from '@tanstack/react-router';
import { createContext, use, useLayoutEffect, useState } from 'react';

import type { UserPreferencesThemeDef } from '#/lib/theme';

import {
  handleThemeCookie,
  themeAttr,
  userPreferenceThemes,
} from '#/lib/theme';

type ThemeContextVal = {
  setTheme: (theme: UserPreferencesThemeDef) => void;
  theme: UserPreferencesThemeDef | undefined;
};

const ThemeContext = createContext<ThemeContextVal | null>(null);

type ThemeProviderPropsDef = PropsWithChildren<{
  initialTheme: UserPreferencesThemeDef | undefined;
}>;

export const ThemeProvider = ({
  children,
  initialTheme,
}: ThemeProviderPropsDef) => {
  const [themeContextValue, setThemeContextValue] =
    useState<UserPreferencesThemeDef>(initialTheme as UserPreferencesThemeDef);

  const { setThemeCookie } = handleThemeCookie();

  const handleSetTheme = (selectedTheme: UserPreferencesThemeDef) => {
    setThemeCookie(selectedTheme);
    setThemeContextValue(selectedTheme);
  };

  const themeScript = `(function() {
    try {
      const isThemeDefined = !!document.documentElement.getAttribute('${themeAttr}');
      
      if (!isThemeDefined) {
        const themePreference = (matchMedia('(prefers-color-scheme: dark)').matches ? '${userPreferenceThemes.dark}' : '${userPreferenceThemes.light}');
        document.documentElement.setAttribute('${themeAttr}', themePreference);
      }
    } catch (e) {}
  })();`;

  useLayoutEffect(() => {
    if (!initialTheme) {
      // ? If no theme cookie, grab theme attr value set by themeScript and set cookie and context
      const themePreference = document.documentElement.getAttribute(themeAttr);

      if (themePreference) {
        handleSetTheme(themePreference as UserPreferencesThemeDef);
      }
    }
  }, []);

  return (
    <ThemeContext
      value={{ setTheme: handleSetTheme, theme: themeContextValue }}
    >
      <ScriptOnce children={themeScript} />
      {children}
    </ThemeContext>
  );
};

export const useTheme = () => {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme called outside of ThemeProvider!');

  return context;
};
