import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '../store/useThemeStore';

/**
 * One button used everywhere, styled by `variant`.
 *
 *   <Button title="Save" onPress={save} loading={saving} />
 *   <Button title="Cancel" variant="secondary" onPress={goBack} />
 *   <Button title="Delete" variant="danger" onPress={remove} />
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isDisabled = disabled || loading;
  const labelColor = {
    primary: theme.colors.onPrimary,
    secondary: theme.colors.text,
    danger: theme.colors.onPrimary,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      // Pressable gives us the pressed state so we can dim the button on touch.
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <Text style={[styles.label, { color: labelColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const createStyles = ({ colors, spacing, radius, fontSize }) =>
  StyleSheet.create({
    base: {
      minHeight: 48, // comfortable touch target
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    primary: { backgroundColor: colors.primary },
    secondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    danger: { backgroundColor: colors.danger },
    pressed: { opacity: 0.75 },
    disabled: { opacity: 0.5 },
    label: { fontSize: fontSize.md, fontWeight: '600' },
  });
