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
      <Text style={[type.title, { color: colors.text }]}>Ask the stars</Text>
      <Text style={[type.body, { color: colors.textMuted }]}>Try one of these, or ask your own question.</Text>
      {PROMPTS.map((p) => (
        <Pressable
          key={p}
          onPress={() => onPick(p)}
          accessibilityRole="button"
          style={[styles.chip, { backgroundColor: colors.surface }]}
        >
          <Text style={[type.body, { color: colors.text }]}>{p}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: spacing.md, gap: spacing.sm },
  chip: { minHeight: 44, justifyContent: 'center', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
});
