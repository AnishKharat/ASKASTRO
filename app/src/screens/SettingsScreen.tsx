import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
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
    <Screen edges={['bottom']}>
      <View style={styles.body}>
        <Text style={[type.small, { color: colors.textMuted }]}>THEME</Text>
        <View style={[styles.seg, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(['dark', 'light'] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === m }}
              style={[styles.opt, mode === m && { backgroundColor: colors.primary }]}
            >
              <Text style={[type.bodyBold, { color: mode === m ? colors.onPrimary : colors.text }]}>
                {m === 'dark' ? '☾  Dark' : '☀  Light'}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[type.small, { color: colors.textMuted, marginTop: spacing.md }]}>DATA</Text>
        <Pressable
          onPress={confirmClear}
          accessibilityRole="button"
          style={[styles.clear, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[type.bodyBold, { color: colors.danger }]}>Clear chat</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: spacing.sm },
  seg: { flexDirection: 'row', padding: spacing.xs, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth },
  opt: { flex: 1, minHeight: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  clear: { minHeight: 44, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
});
