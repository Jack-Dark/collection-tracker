import type { PropsWithChildren } from 'react';

import { ScriptOnce, useRouter } from '@tanstack/react-router';
import { createContext, use } from 'react';

import type { UserPreferencesThemeDef } from '#/lib/theme';

import { handleThemeCookie, userPreferenceThemes } from '#/lib/theme';

type ThemeContextVal = {
  setTheme: (theme: UserPreferencesThemeDef) => void;
  theme: UserPreferencesThemeDef | undefined;
};

const ThemeContext = createContext<ThemeContextVal | null>(null);

type ThemeProviderPropsDef = PropsWithChildren<{
  theme: UserPreferencesThemeDef | undefined;
}>;

export const ThemeProvider = ({ children, theme }: ThemeProviderPropsDef) => {
  const router = useRouter();
  const { setThemeCookie } = handleThemeCookie();

  const setTheme = (theme: UserPreferencesThemeDef) => {
    setThemeCookie(theme);

    return router.invalidate();
  };

  const themeScript = `(function() {
  try {
    const themeAttr = 'data-theme';
    const isThemeDefined = !!document.documentElement.getAttribute(themeAttr);
    
    if (!isThemeDefined) {
      const themePreference = (matchMedia('(prefers-color-scheme: dark)').matches ? '${userPreferenceThemes.dark}' : '${userPreferenceThemes.light}');
      document.documentElement.setAttribute(themeAttr, themePreference);
    }
  } catch (e) {}
})();`;

  return (
    <ThemeContext value={{ setTheme, theme }}>
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
