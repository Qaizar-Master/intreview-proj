import { useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import Button from '../components/Button';
import SegmentedField from '../components/SegmentedField';
import TextField from '../components/TextField';
import { toErrorMessage } from '../api/client';
import { DIFFICULTIES, STATUSES } from '../constants/practice';
import { usePracticeStore } from '../store/usePracticeStore';
import { useTheme } from '../store/useThemeStore';

/**
 * Add / Edit screen. One screen serves both jobs — the only differences are the
 * initial values, the title, and which store action runs on save.
 */
export default function PracticeFormScreen({ navigation, route }) {
  const { mode, practice } = route.params ?? { mode: 'create' };
  const isEdit = mode === 'edit';

  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const addPractice = usePracticeStore((s) => s.addPractice);
  const editPractice = usePracticeStore((s) => s.editPractice);

  // Controlled inputs: React state is the single source of truth for the form.
  // Duration is kept as a string because TextInput always gives us text; it is
  // converted to a number only at submit time.
  const [title, setTitle] = useState(practice?.title ?? '');
  const [description, setDescription] = useState(practice?.description ?? '');
  const [duration, setDuration] = useState(
    practice?.duration_minutes ? String(practice.duration_minutes) : '',
  );
  const [difficulty, setDifficulty] = useState(practice?.difficulty ?? 'Beginner');
  const [status, setStatus] = useState(practice?.status ?? 'Pending');

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Edit Practice' : 'Add Practice' });
  }, [navigation, isEdit]);

  /**
   * Client-side validation.
   *
   * The backend validates too and is the real authority — this exists to give
   * instant feedback without a network round trip. The rules mirror the
   * Pydantic constraints in backend/app/schemas.py.
   */
  function validate() {
    const next = {};

    if (!title.trim()) {
      next.title = 'Title is required.';
    } else if (title.trim().length > 200) {
      next.title = 'Title must be 200 characters or fewer.';
    }

    const minutes = Number(duration);
    if (!duration.trim()) {
      next.duration = 'Duration is required.';
    } else if (!Number.isInteger(minutes)) {
      next.duration = 'Duration must be a whole number of minutes.';
    } else if (minutes <= 0) {
      next.duration = 'Duration must be greater than 0.';
    } else if (minutes > 1440) {
      next.duration = 'Duration cannot exceed 1440 minutes (24 hours).';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      duration_minutes: Number(duration),
      difficulty,
      status,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await editPractice(practice.id, payload);
      } else {
        await addPractice(payload);
      }
      // The store already holds the new data, so the list is up to date the
      // moment we land back on it.
      navigation.goBack();
    } catch (err) {
      // Stay on the form so the user's typing is not lost.
      Alert.alert('Could not save', toErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      // Without this the keyboard covers the inputs on iOS.
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TextField
          label="Practice Title"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          placeholder="e.g. Elevator pitch"
          maxLength={200}
          autoFocus={!isEdit}
          returnKeyType="next"
        />

        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What will you practise?"
          multiline
          maxLength={5000}
        />

        <TextField
          label="Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          error={errors.duration}
          placeholder="e.g. 15"
          keyboardType="number-pad"
          maxLength={4}
        />

        <SegmentedField
          label="Difficulty"
          options={DIFFICULTIES}
          value={difficulty}
          onChange={setDifficulty}
        />

        <SegmentedField
          label="Status"
          options={STATUSES}
          value={status}
          onChange={setStatus}
        />

        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
            disabled={saving}
            style={styles.action}
          />
          <Button
            title={isEdit ? 'Save Changes' : 'Save'}
            onPress={handleSave}
            loading={saving}
            style={styles.action}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xxl },
    actions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    action: { flex: 1 }, // two equal-width buttons on any screen size
  });
