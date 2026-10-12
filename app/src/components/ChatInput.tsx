import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { radius, spacing, type, useTheme } from '../theme';

type Props = { value: string; onChange: (t: string) => void; onSend: () => void; onStop: () => void; streaming: boolean };

export default function ChatInput({ value, onChange, onSend, onStop, streaming }: Props) {
  const { colors } = useTheme();
  const canSend = value.trim().length > 0;
  return (
    <View style={styles.row}>
      <TextInput
        value={value}
        onChangeText={onChange}
        editable={!streaming}
        placeholder="Ask about astrology…"
        placeholderTextColor={colors.textMuted}
        multiline
        style={[type.body, styles.input, { backgroundColor: colors.surface, color: colors.text }]}
      />
      <Pressable
        onPress={streaming ? onStop : onSend}
        disabled={!streaming && !canSend}
        accessibilityRole="button"
        accessibilityLabel={streaming ? 'Stop' : 'Send'}
        style={[styles.btn, { backgroundColor: colors.primary, opacity: !streaming && !canSend ? 0.5 : 1 }]}
      >
        <Text style={[type.body, { color: colors.onPrimary }]}>{streaming ? 'Stop' : 'Send'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, padding: spacing.md },
  input: { flex: 1, maxHeight: 120, minHeight: 44, borderRadius: radius.md, paddingHorizontal: spacing.md },
  btn: { minHeight: 44, minWidth: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
