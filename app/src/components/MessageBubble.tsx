import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import type { Message } from '../api/chat';
import { radius, spacing, type, useTheme } from '../theme';
import TypingDots from './TypingDots';

export default function MessageBubble({ message, typing }: { message: Message; typing?: boolean }) {
  const { colors } = useTheme();
  const mine = message.role === 'user';

  if (mine) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.primaryEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        accessibilityLabel={`You: ${message.content}`}
        style={[styles.bubble, styles.mine]}
      >
        <Text style={[type.body, { color: colors.onPrimary }]}>{message.content}</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.botRow} accessibilityLabel={typing ? undefined : `AskAstro: ${message.content}`}>
      <View style={[styles.avatar, { backgroundColor: colors.surface, borderColor: colors.brand }]}>
        <Text style={{ color: colors.brand, fontSize: 14 }}>✦</Text>
      </View>
      <View style={[styles.bubble, styles.bot, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {typing ? <TypingDots /> : <Text style={[type.body, { color: colors.text }]}>{message.content}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  mine: { alignSelf: 'flex-end', maxWidth: '85%', marginVertical: spacing.xs, borderBottomRightRadius: 4 },
  botRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, alignSelf: 'flex-start', maxWidth: '92%', marginVertical: spacing.xs },
  bot: { flexShrink: 1, borderWidth: StyleSheet.hairlineWidth, borderBottomLeftRadius: 4 },
  avatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
