import { useMemo } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ThemeToggle from './src/components/ThemeToggle';
import PracticeFormScreen from './src/screens/PracticeFormScreen';
import PracticeListScreen from './src/screens/PracticeListScreen';
import { useTheme } from './src/store/useThemeStore';

const Stack = createNativeStackNavigator();

/**
 * App entry point.
 *
 * A native stack navigator with two screens. "Stack" means screens pile on top
 * of one another: opening the form pushes it over the list, and going back pops
 * it off, revealing the list exactly as it was.
 *
 * The providers wrap everything:
 *   SafeAreaProvider    – supplies notch/home-indicator insets
 *   NavigationContainer – holds the navigation state
 */
export default function App() {
  const { colors, isDark } = useTheme();

  /**
   * React Navigation paints the header and the screen background itself, so it
   * needs its own copy of the palette — otherwise the header would stay white
   * while the content turned dark.
   */
  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        primary: colors.primary,
      },
    };
  }, [isDark, colors]);

  return (
    <SafeAreaProvider>
      {/* Dark theme needs light status-bar icons, and vice versa. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="PracticeList"
            component={PracticeListScreen}
            options={{
              title: 'Practice Sessions',
              headerRight: () => <ThemeToggle />,
            }}
          />
          <Stack.Screen
            name="PracticeForm"
            component={PracticeFormScreen}
            options={{
              title: 'Add Practice', // replaced at runtime by the screen itself
              presentation: 'card',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
