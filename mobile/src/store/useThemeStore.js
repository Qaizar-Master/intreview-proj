import { useMemo } from 'react';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fontSize, palettes, radius, shadowFor, spacing } from '../constants/theme';

/** Fall back to the phone's own light/dark setting the very first time. */
const deviceMode = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

/**
 * Which theme is active.
 *
 * Wrapped in zustand's `persist` middleware, so the choice is written to
 * AsyncStorage and restored on the next launch — closing the app does not reset
 * it. Rehydration is asynchronous, which is why `hasHydrated` exists: without it
 * the app would paint the default theme for one frame and then flip.
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: deviceMode,

      toggleMode: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
      setMode: (mode) => set({ mode }),

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: 'practice-theme', // the AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only `mode` is worth saving; `hasHydrated` is runtime-only.
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

/**
 * The hook every component uses to style itself.
 *
 *   const { colors, spacing } = useTheme();
 *
 * Returns a memoised object so it is a stable dependency for the
 * `useMemo(() => createStyles(theme), [theme])` pattern in each component.
 */
export function useTheme() {
  const mode = useThemeStore((s) => s.mode);

  return useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: palettes[mode],
      shadow: shadowFor(mode),
      spacing,
      radius,
      fontSize,
    }),
    [mode],
  );
}
