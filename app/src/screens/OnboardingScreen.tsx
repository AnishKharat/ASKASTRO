import { StyleSheet, Text, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import Screen from '../components/Screen';
import { useSettings } from '../store/settings';
import { radius, spacing, type, useTheme } from '../theme';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const finish = useSettings((s) => s.finishOnboarding);
  return (
    <Screen>
      <View style={styles.body}>
        <View style={[styles.orb, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
          <Text style={{ color: colors.accent, fontSize: 44 }}>✦</Text>
        </View>
        <Text style={[type.display, styles.center, { color: colors.accent }]}>Welcome to AskAstro</Text>
        <Text style={[type.body, styles.center, { color: colors.text }]}>
          A calm place to explore astrology through conversation: signs, planets, houses, and what they might mean for
          you.
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[type.small, { color: colors.textMuted }]}>
            AskAstro is for reflection and entertainment. It is not medical, legal, or financial advice, and it can't
            predict your future. If you're struggling, please reach out to someone you trust or a local support line.
          </Text>
        </View>
      </View>
      <GradientButton label="I understand, get started" onPress={finish} style={styles.btn} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  center: { textAlign: 'center' },
  orb: {
    alignSelf: 'center', width: 96, height: 96, borderRadius: 48, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: spacing.md },
  btn: { margin: spacing.lg },
});
