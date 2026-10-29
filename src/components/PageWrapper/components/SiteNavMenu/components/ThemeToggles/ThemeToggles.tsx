import { Toggle, ToggleGroup } from '@base-ui/react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { twJoin } from 'tailwind-merge';

import { userPreferenceThemes } from '../../../../../../lib/theme';
import { useTheme } from '../../../../../ThemeProvider';

export const ThemeToggles = () => {
  const { setTheme, theme: selectedTheme } = useTheme();

  const themeToggleItems = [
    {
      label: 'Light Mode',
      theme: userPreferenceThemes.light,
      ThemeIcon: LightModeIcon,
    },
    {
      label: 'Dark Mode',
      theme: userPreferenceThemes.dark,
      ThemeIcon: DarkModeIcon,
    },
  ] as const;

  return (
    <ToggleGroup
      aria-label="User Theme"
      className="grid gap-1 grid-cols-2 border border-theme-divider-2 rounded-4xl p-1 w-25"
      defaultValue={[userPreferenceThemes.dark]}
    >
      {themeToggleItems.map(({ label, theme, ThemeIcon }) => {
        const isActive = selectedTheme === theme;

        return (
          <Toggle
            aria-label={label}
            className={twJoin(
              `p-0.5 flex items-center justify-center rounded-4xl cursor-pointer border border-transparent`,
              theme === userPreferenceThemes.light
                ? // ? light mode toggle
                  isActive
                  ? 'light:bg-amber-50 light:text-gray-500 light:border-amber-300'
                  : 'dark:bg-transparent dark:text-theme-t2 dark:hover:text-amber-300'
                : // ? dark mode toggle
                  isActive
                  ? 'dark:bg-gray-800 dark:text-white dark:border-gray-600'
                  : 'light:bg-transparent light:text-gray-500 light:hover:text-theme-link-hover',
            )}
            key={theme}
            onClick={() => {
              setTheme(theme);
            }}
            value={theme}
          >
            <ThemeIcon className="inherit" fontSize="inherit" />
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
};
