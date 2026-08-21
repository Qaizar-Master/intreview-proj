import { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '../store/useThemeStore';

/**
 * A labelled text input that shows its own validation error.
 *
 * Keeping the label, input and error together means the form screen doesn't
 * repeat this markup for every field.
 */
export default function TextField({
  label,
  value,
  onChangeText,
  error,
  multiline = false,
  ...inputProps
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          multiline && styles.multiline,
          !!error && styles.inputError, // red border only when invalid
        ]}
        {...inputProps}
      />

      {/* Reserve nothing when valid: the row simply disappears. */}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, fontSize }) =>
  StyleSheet.create({
    wrapper: { marginBottom: spacing.lg },
    label: {
      fontSize: fontSize.sm,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      minHeight: 48,
      fontSize: fontSize.md,
      color: colors.text,
    },
    multiline: {
      minHeight: 96,
      paddingTop: spacing.md,
      textAlignVertical: 'top', // Android: start text at the top, not centred
    },
    inputError: { borderColor: colors.danger },
    error: {
      color: colors.danger,
      fontSize: fontSize.xs,
      marginTop: spacing.xs,
    },
  });
