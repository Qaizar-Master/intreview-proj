import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../store/useThemeStore';

/** A small coloured pill — used for difficulty and status on each card. */
export default function Badge({ label, bg, fg }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const createStyles = ({ spacing, radius, fontSize }) =>
  StyleSheet.create({
    badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      alignSelf: 'flex-start',
    },
    text: {
      fontSize: fontSize.xs,
      fontWeight: '700',
    },
  });
