import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../store/settings';
import { radius, spacing, type, useTheme } from '../theme';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const finish = useSettings((s) => s.finishOnboarding);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.body}>
        <Text style={[type.title, { color: colors.accent }]}>Welcome to AskAstro</Text>
        <Text style={[type.body, { color: colors.text }]}>
          A calm place to explore astrology through conversation: signs, planets, houses, and what they might mean for
          you.
        </Text>
        <Text style={[type.body, { color: colors.textMuted }]}>
          AskAstro is for reflection and entertainment. It is not medical, legal, or financial advice, and it can't
          predict your future. If you're struggling, please reach out to someone you trust or a local support line.
        </Text>
      </View>
      <Pressable
        onPress={finish}
        accessibilityRole="button"
        style={[styles.btn, { backgroundColor: colors.primary }]}
      >
        <Text style={[type.body, { color: colors.onPrimary }]}>I understand, get started</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  btn: { minHeight: 44, margin: spacing.lg, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
