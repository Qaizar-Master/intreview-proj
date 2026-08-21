import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import Badge from './Badge';
import {
  difficultyStyle,
  formatDuration,
  statusStyle,
} from '../constants/practice';
import { useTheme } from '../store/useThemeStore';

/**
 * One practice session in the list, with its row actions.
 *
 * This component is "presentational": it receives data and callbacks and holds
 * no state of its own, so it is easy to reason about and reuse.
 */
export default function PracticeCard({
  practice,
  onEdit,
  onComplete,
  onDelete,
  busy = false,
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

  const { title, description, duration_minutes, difficulty, status } = practice;
  const isCompleted = status === 'Completed';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {title}
        </Text>

        {busy && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      {!!description && (
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      )}

      <View style={styles.badges}>
        <Badge
          label={formatDuration(duration_minutes)}
          bg={colors.surfaceAlt}
          fg={colors.textMuted}
        />
        <Badge label={difficulty} {...difficultyStyle(colors)[difficulty]} />
        <Badge label={status} {...statusStyle(colors)[status]} />
      </View>

      <View style={styles.actions}>
        {/* Completing is irreversible in this API, so hide it once done. */}
        {!isCompleted && (
          <Action
            label="Complete"
            color={colors.success}
            onPress={onComplete}
            disabled={busy}
            styles={styles}
          />
        )}
        <Action
          label="Edit"
          color={colors.primary}
          onPress={onEdit}
          disabled={busy}
          styles={styles}
        />
        <Action
          label="Delete"
          color={colors.danger}
          onPress={onDelete}
          disabled={busy}
          styles={styles}
        />
      </View>
    </View>
  );
}

/** A small text button used only inside the card's action row. */
function Action({ label, color, onPress, disabled, styles }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8} // easier to hit than the text bounds alone
      style={({ pressed }) => [
        styles.action,
        pressed && styles.actionPressed,
        disabled && styles.actionDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.actionText, { color }]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = ({ colors, spacing, radius, fontSize, shadow }) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    title: {
      flex: 1, // take the space left over by the spinner
      fontSize: fontSize.lg,
      fontWeight: '700',
      color: colors.text,
    },
    titleCompleted: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    description: {
      marginTop: spacing.xs,
      fontSize: fontSize.sm,
      color: colors.textMuted,
      lineHeight: 20,
    },
    badges: {
      flexDirection: 'row',
      flexWrap: 'wrap', // wrap instead of overflowing on narrow screens
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.lg,
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    action: { paddingVertical: spacing.xs },
    actionPressed: { opacity: 0.6 },
    actionDisabled: { opacity: 0.4 },
    actionText: { fontSize: fontSize.sm, fontWeight: '700' },
  });
