import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatScreen from './src/screens/ChatScreen';
import { useTheme, useThemeMode } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const { colors } = useTheme();
  const mode = useThemeMode((s) => s.mode);
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
          <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'AskAstro' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
