import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme, useThemeStore } from '../store/useThemeStore';

/**
 * The light/dark switch in the header.
 *
 * Reads and writes the theme store directly rather than taking props — it is a
 * self-contained control, so the screen that renders it needs to know nothing
 * about theming.
 */
export default function ThemeToggle() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const toggleMode = useThemeStore((s) => s.toggleMode);

  const { isDark } = theme;

  return (
    <Pressable
      onPress={toggleMode}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      // Says what tapping does, not what the current state is.
      accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Text style={styles.icon}>{isDark ? '☀︎' : '☾'}</Text>
      <Text style={styles.label}>{isDark ? 'Light' : 'Dark'}</Text>
    </Pressable>
  );
}

const createStyles = ({ colors, spacing, radius, fontSize }) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceAlt,
    },
    pressed: { opacity: 0.6 },
    icon: { fontSize: fontSize.sm, color: colors.primary },
    label: {
      fontSize: fontSize.xs,
      fontWeight: '700',
      color: colors.text,
    },
  });
