import { StyleSheet, TextInput, View } from 'react-native';
import { radius, spacing, type, useTheme } from '../theme';
import GradientButton from './GradientButton';

type Props = { value: string; onChange: (t: string) => void; onSend: () => void; onStop: () => void; streaming: boolean };

export default function ChatInput({ value, onChange, onSend, onStop, streaming }: Props) {
  const { colors } = useTheme();
  const canSend = value.trim().length > 0;
  return (
    <View style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        editable={!streaming}
        placeholder="Ask the stars…"
        placeholderTextColor={colors.textMuted}
        multiline
        style={[type.body, styles.input, { color: colors.text }]}
      />
      <GradientButton
        label={streaming ? '■' : '↑'}
        accessibilityLabel={streaming ? 'Stop' : 'Send'}
        onPress={streaming ? onStop : onSend}
        disabled={!streaming && !canSend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, margin: spacing.md,
    padding: spacing.xs, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, maxHeight: 120, minHeight: 44, paddingHorizontal: spacing.md, paddingVertical: 10 },
});
