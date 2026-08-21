import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Button from './Button';
import { useTheme } from '../store/useThemeStore';

/**
 * The three "not showing data" states a screen can be in. Grouped in one file
 * because they are small and always used together.
 */

/** Full-screen spinner for the very first load. */
export function LoadingState({ message = 'Loading practices…' }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

/** Something failed. Always offer a way out — here, a retry. */
export function ErrorState({ message, onRetry }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.centered}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorBody}>{message}</Text>
      {onRetry && <Button title="Try again" onPress={onRetry} style={styles.cta} />}
    </View>
  );
}

/** The request succeeded but there is nothing to show yet. */
export function EmptyState({ onAdd }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.centered}>
      <Text style={styles.emptyTitle}>No practices yet</Text>
      <Text style={styles.muted}>
        Add your first communication practice session to get started.
      </Text>
      {onAdd && <Button title="Add a practice" onPress={onAdd} style={styles.cta} />}
    </View>
  );
}

/** A compact error bar shown above the list when data is already on screen. */
export function ErrorBanner({ message, onDismiss }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{message}</Text>
      {onDismiss && (
        <Text style={styles.bannerDismiss} onPress={onDismiss}>
          Dismiss
        </Text>
      )}
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, fontSize }) =>
  StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.sm,
    },
    muted: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
      textAlign: 'center',
    },
    errorTitle: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      color: colors.text,
    },
    errorBody: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
    emptyTitle: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      color: colors.text,
    },
    cta: { marginTop: spacing.md, alignSelf: 'stretch' },
    banner: {
      backgroundColor: colors.dangerLight,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    bannerText: { color: colors.danger, fontSize: fontSize.sm },
    bannerDismiss: {
      color: colors.danger,
      fontSize: fontSize.xs,
      fontWeight: '700',
      marginTop: spacing.sm,
    },
  });
