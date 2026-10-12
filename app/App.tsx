import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatScreen from './src/screens/ChatScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useSettings } from './src/store/settings';
import { useTheme } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const { colors } = useTheme();
  const { mode, onboarded } = useSettings();
  const [ready, setReady] = useState(useSettings.persist.hasHydrated());
  useEffect(() => useSettings.persist.onFinishHydration(() => setReady(true)), []);
  if (!ready) return null; // avoid flashing onboarding before saved settings load

  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          ...base,
          colors: {
            ...base.colors,
            background: colors.background, card: colors.background, text: colors.text,
            primary: colors.primary, border: colors.surface,
          },
        }}
      >
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        <Stack.Navigator>
          {onboarded ? (
            <>
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={({ navigation }) => ({
                  title: 'AskAstro',
                  headerRight: () => (
                    <Pressable
                      onPress={() => navigation.navigate('Settings')}
                      accessibilityRole="button"
                      style={{ minHeight: 44, justifyContent: 'center' }}
                    >
                      <Text style={{ color: colors.link, fontSize: 16 }}>Settings</Text>
                    </Pressable>
                  ),
                })}
              />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          ) : (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
