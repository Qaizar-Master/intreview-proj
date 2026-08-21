import { useCallback, useEffect, useMemo } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PracticeCard from '../components/PracticeCard';
import {
  EmptyState,
  ErrorBanner,
  ErrorState,
  LoadingState,
} from '../components/StateViews';
import { usePracticeStore } from '../store/usePracticeStore';
import { useTheme } from '../store/useThemeStore';

/**
 * Home screen: the list of practice sessions.
 *
 * Every piece of data comes from the Zustand store, so when an action updates
 * the store this screen re-renders on its own — no manual refresh anywhere.
 */
export default function PracticeListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { spacing } = theme;

  // Selecting one field at a time means this component only re-renders when
  // that specific value changes, rather than on every store update.
  const practices = usePracticeStore((s) => s.practices);
  const loading = usePracticeStore((s) => s.loading);
  const refreshing = usePracticeStore((s) => s.refreshing);
  const error = usePracticeStore((s) => s.error);
  const busyId = usePracticeStore((s) => s.busyId);

  const fetchPractices = usePracticeStore((s) => s.fetchPractices);
  const completePractice = usePracticeStore((s) => s.completePractice);
  const removePractice = usePracticeStore((s) => s.removePractice);
  const clearError = usePracticeStore((s) => s.clearError);

  // Load once when the screen first mounts.
  useEffect(() => {
    fetchPractices();
  }, [fetchPractices]);

  const goToCreate = useCallback(
    () => navigation.navigate('PracticeForm', { mode: 'create' }),
    [navigation],
  );

  const goToEdit = useCallback(
    (practice) => navigation.navigate('PracticeForm', { mode: 'edit', practice }),
    [navigation],
  );

  /** Deleting is destructive and irreversible, so always confirm first. */
  const confirmDelete = useCallback(
    (practice) => {
      Alert.alert(
        'Delete practice',
        `Delete "${practice.title}"? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => removePractice(practice.id),
          },
        ],
      );
    },
    [removePractice],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <PracticeCard
        practice={item}
        busy={busyId === item.id}
        onEdit={() => goToEdit(item)}
        onComplete={() => completePractice(item.id)}
        onDelete={() => confirmDelete(item)}
      />
    ),
    [busyId, goToEdit, completePractice, confirmDelete],
  );

  // First load with nothing on screen yet.
  if (loading && practices.length === 0) return <LoadingState />;

  // Failed with nothing to show — a full-screen error is appropriate.
  if (error && practices.length === 0) {
    return <ErrorState message={error} onRetry={() => fetchPractices()} />;
  }

  const completedCount = practices.filter((p) => p.status === 'Completed').length;

  return (
    <View style={styles.container}>
      <FlatList
        data={practices}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          // Leave room for the floating button so the last card isn't hidden.
          { paddingBottom: spacing.xxl * 2 + insets.bottom },
          practices.length === 0 && styles.listContentEmpty,
        ]}
        // Pull down to refresh.
        refreshing={refreshing}
        onRefresh={() => fetchPractices({ isRefresh: true })}
        ListHeaderComponent={
          <View>
            {/* Errors during an action: show inline, keep the list visible. */}
            {!!error && <ErrorBanner message={error} onDismiss={clearError} />}

            {practices.length > 0 && (
              <Text style={styles.summary}>
                {practices.length} practice{practices.length === 1 ? '' : 's'} ·{' '}
                {completedCount} completed
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={<EmptyState onAdd={goToCreate} />}
      />

      <Pressable
        onPress={goToCreate}
        style={({ pressed }) => [
          styles.fab,
          { bottom: spacing.xl + insets.bottom },
          pressed && styles.fabPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Add a practice"
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const createStyles = ({ colors, spacing, radius, fontSize, shadow }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    listContent: {
      padding: spacing.lg,
    },
    listContentEmpty: { flexGrow: 1 }, // let EmptyState centre itself vertically
    summary: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
      marginBottom: spacing.md,
    },
    fab: {
      position: 'absolute',
      right: spacing.xl,
      width: 56,
      height: 56,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow,
      elevation: 6,
    },
    fabPressed: { backgroundColor: colors.primaryDark },
    fabIcon: {
      color: colors.onPrimary,
      fontSize: 30,
      lineHeight: 34,
      fontWeight: '300',
    },
  });
