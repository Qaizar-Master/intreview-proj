/**
 * Design tokens.
 *
 * Colours come in two palettes with identical keys, so any component can read
 * `colors.surface` without knowing which theme is active. The scales below
 * (spacing, radius, fontSize) are shared — only colour changes between themes.
 */

const light = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F7',
  border: '#E3E8EF',

  text: '#101828',
  textMuted: '#667085',

  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF4FF',
  onPrimary: '#FFFFFF',

  success: '#059669',
  successLight: '#ECFDF5',

  danger: '#DC2626',
  dangerLight: '#FEF2F2',

  warning: '#B45309',
  warningLight: '#FFFAEB',
};

/**
 * The dark palette is not an inversion of the light one.
 *
 * Two deliberate differences: the surfaces are lifted off pure black (#0D1117
 * rather than #000) because pure black makes elevation impossible to read, and
 * the accents are lightened — #2563EB is legible on white but too dark to read
 * against a dark ground, so it becomes #4D8DFF.
 */
const dark = {
  background: '#0D1117',
  surface: '#161B22',
  surfaceAlt: '#1C232D',
  border: '#272E3A',

  text: '#E6EDF3',
  textMuted: '#8B98A9',

  primary: '#4D8DFF',
  primaryDark: '#3B7BEE',
  primaryLight: '#16233B',
  onPrimary: '#FFFFFF',

  success: '#3FB950',
  successLight: '#122A18',

  danger: '#F85149',
  dangerLight: '#2D1517',

  warning: '#D29922',
  warningLight: '#2A2010',
};

export const palettes = { light, dark };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 6, md: 10, lg: 14, pill: 999 };

export const fontSize = { xs: 12, sm: 14, md: 16, lg: 18, xl: 22 };

/**
 * Card elevation. Shadows are nearly invisible on a dark ground, so dark mode
 * leans on the border instead of faking depth with a shadow nobody can see.
 */
export function shadowFor(mode) {
  if (mode === 'dark') {
    return { shadowColor: 'transparent', elevation: 0 };
  }
  return {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  };
}
