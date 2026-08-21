/**
 * These strings must match the backend's `Difficulty` and `Status` enums in
 * backend/app/enums.py exactly — they travel over the wire as-is.
 */

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const STATUSES = ['Pending', 'Completed'];

/**
 * Badge colours. These are functions of the active palette rather than fixed
 * values, because "Advanced red" is a different red in light and dark mode.
 */
export function difficultyStyle(colors) {
  return {
    Beginner: { bg: colors.successLight, fg: colors.success },
    Intermediate: { bg: colors.warningLight, fg: colors.warning },
    Advanced: { bg: colors.dangerLight, fg: colors.danger },
  };
}

export function statusStyle(colors) {
  return {
    Pending: { bg: colors.primaryLight, fg: colors.primary },
    Completed: { bg: colors.successLight, fg: colors.success },
  };
}

/** "90" -> "1h 30m", "45" -> "45m". Purely for display. */
export function formatDuration(minutes) {
  const total = Number(minutes) || 0;
  if (total < 60) return `${total}m`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}
