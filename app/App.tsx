import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Lora_600SemiBold } from '@expo-google-fonts/lora';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatScreen from './src/screens/ChatScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useSettings } from './src/store/settings';
import { fonts, useTheme } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const { colors } = useTheme();
  const { mode, onboarded } = useSettings();
  const [ready, setReady] = useState(useSettings.persist.hasHydrated());
  useEffect(() => useSettings.persist.onFinishHydration(() => setReady(true)), []);
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Lora_600SemiBold });
  if (!ready || !fontsLoaded) return null; // avoid flashing onboarding / unstyled text before load

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
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.link,
            headerTitleStyle: { fontFamily: fonts.heading, fontSize: 20, color: colors.accent },
          }}
        >
          {onboarded ? (
            <>
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={({ navigation }) => ({
                  title: '✦ AskAstro',
                  headerRight: () => (
                    <Pressable
                      onPress={() => navigation.navigate('Settings')}
                      accessibilityRole="button"
                      style={{ minHeight: 44, justifyContent: 'center' }}
                    >
                      <Text style={{ color: colors.link, fontSize: 16, fontFamily: fonts.bold }}>Settings</Text>
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
