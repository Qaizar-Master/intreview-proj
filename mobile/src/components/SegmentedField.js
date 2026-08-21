import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../store/useThemeStore';

/**
 * A row of mutually exclusive choices — used for Difficulty and Status.
 *
 * React Native has no built-in dropdown that looks the same on both platforms,
 * and with only two or three options a visible row is faster to use than a
 * picker: every choice is one tap, with no hidden state.
 */
export default function SegmentedField({ label, options, value, onChange }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        {options.map((option) => {
          const selected = option === value;

          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.pressed,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.text, selected && styles.textSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
    row: { flexDirection: 'row', gap: spacing.sm },
    option: {
      flex: 1, // share the width evenly, so it adapts to any screen size
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    optionSelected: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primary,
    },
    pressed: { opacity: 0.7 },
    text: {
      fontSize: fontSize.sm,
      fontWeight: '600',
      color: colors.textMuted,
      textAlign: 'center',
    },
    textSelected: { color: colors.primary },
  });
