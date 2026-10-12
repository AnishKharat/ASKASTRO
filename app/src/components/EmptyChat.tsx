import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, type, useTheme } from '../theme';

const PROMPTS = [
  'What do the four elements mean in astrology?',
  'What is Mercury retrograde, really?',
  'How do Western and Vedic astrology differ?',
];

export default function EmptyChat({ onPick }: { onPick: (prompt: string) => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.orb, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
        <Text style={{ color: colors.accent, fontSize: 36 }}>✦</Text>
      </View>
      <Text style={[type.display, styles.center, { color: colors.text }]}>Ask the stars</Text>
      <Text style={[type.body, styles.center, { color: colors.textMuted }]}>
        Try one of these, or ask your own question.
      </Text>
      {PROMPTS.map((p) => (
        <Pressable
          key={p}
          onPress={() => onPick(p)}
          accessibilityRole="button"
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.accent }}>✦</Text>
          <Text style={[type.body, { color: colors.text, flex: 1 }]}>{p}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  center: { textAlign: 'center' },
  orb: {
    alignSelf: 'center', width: 84, height: 84, borderRadius: 42, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44, borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
});
