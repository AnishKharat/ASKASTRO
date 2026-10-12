import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../store/chat';
import { useSettings } from '../store/settings';
import { radius, spacing, type, useTheme } from '../theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { mode, setMode } = useSettings();
  const clear = useChat((s) => s.clear);

  const confirmClear = () =>
    Alert.alert('Clear chat?', 'This deletes your conversation from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.body}>
        <Text style={[type.body, { color: colors.textMuted }]}>Theme</Text>
        <View style={styles.row}>
          {(['dark', 'light'] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === m }}
              style={[styles.btn, { backgroundColor: mode === m ? colors.primary : colors.surface, flex: 1 }]}
            >
              <Text style={[type.body, { color: mode === m ? colors.onPrimary : colors.text }]}>
                {m === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={confirmClear} accessibilityRole="button" style={[styles.btn, { backgroundColor: colors.surface }]}>
          <Text style={[type.body, { color: colors.danger }]}>Clear chat</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  btn: { minHeight: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
