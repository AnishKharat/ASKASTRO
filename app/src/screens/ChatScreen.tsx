import { randomUUID } from 'expo-crypto';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message, streamChat } from '../api/chat';
import MessageBubble from '../components/MessageBubble';
import { radius, spacing, type, useTheme } from '../theme';

// shortcut: state is local and the input is inline; the chat store and ChatInput component replace both (next roadmap items).
export default function ChatScreen() {
  const { colors } = useTheme();
  const conversationId = useRef(randomUUID()).current;
  const [messages, setMessages] = useState<Message[]>([]); // newest first, for the inverted list
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);

  const make = (role: Message['role'], content: string): Message => ({
    id: randomUUID(), conversationId, role, content, createdAt: new Date().toISOString(),
  });

  const send = async () => {
    const content = text.trim();
    if (!content || streaming) return;
    const user = make('user', content);
    const reply = make('assistant', '');
    const history = [...messages].reverse().concat(user);
    setMessages((m) => [reply, user, ...m]);
    setText('');
    setStreaming(true);
    const patch = (fn: (c: string) => string) =>
      setMessages((m) => m.map((x) => (x.id === reply.id ? { ...x, content: fn(x.content) } : x)));
    try {
      await streamChat(history, (d) => patch((c) => c + d));
    } catch {
      patch((c) => c || 'Something went wrong. Please try again.');
    } finally {
      setStreaming(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        inverted
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item, index }) => (
          <MessageBubble message={item} typing={streaming && index === 0 && !item.content} />
        )}
      />
      <View style={styles.row}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Ask about astrology…"
          placeholderTextColor={colors.textMuted}
          multiline
          style={[type.body, styles.input, { backgroundColor: colors.surface, color: colors.text }]}
        />
        <Pressable
          onPress={send}
          disabled={streaming}
          accessibilityRole="button"
          accessibilityLabel="Send"
          style={[styles.send, { backgroundColor: colors.primary, opacity: streaming ? 0.5 : 1 }]}
        >
          <Text style={[type.body, { color: colors.onPrimary }]}>Send</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, padding: spacing.md },
  input: { flex: 1, maxHeight: 120, minHeight: 44, borderRadius: radius.md, paddingHorizontal: spacing.md },
  send: { minHeight: 44, minWidth: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
