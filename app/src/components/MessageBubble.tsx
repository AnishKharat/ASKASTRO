import { StyleSheet, Text, View } from 'react-native';
import type { Message } from '../api/chat';
import { radius, spacing, type, useTheme } from '../theme';

export default function MessageBubble({ message, typing }: { message: Message; typing?: boolean }) {
  const { colors } = useTheme();
  const mine = message.role === 'user';
  return (
    <View
      accessibilityLabel={`${mine ? 'You' : 'AskAstro'}: ${message.content}`}
      style={[
        styles.bubble,
        mine
          ? { alignSelf: 'flex-end', backgroundColor: colors.primary }
          : { alignSelf: 'flex-start', backgroundColor: colors.surface },
      ]}
    >
      <Text style={[type.body, { color: mine ? colors.onPrimary : colors.text }]}>
        {typing ? '…' : message.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '85%',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginVertical: spacing.xs,
  },
});
