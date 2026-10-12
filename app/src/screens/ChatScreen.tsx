import { randomUUID } from 'expo-crypto';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message, streamChat } from '../api/chat';
import ChatInput from '../components/ChatInput';
import EmptyChat from '../components/EmptyChat';
import MessageBubble from '../components/MessageBubble';
import { useChat } from '../store/chat';
import { radius, spacing, type, useTheme } from '../theme';

export default function ChatScreen() {
  const { colors } = useTheme();
  const { conversationId, messages, streaming, add, patch, remove, setStreaming } = useChat();
  const [text, setText] = useState('');
  const [failed, setFailed] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const make = (role: Message['role'], content: string): Message => ({
    id: randomUUID(), conversationId, role, content, createdAt: new Date().toISOString(),
  });

  // history must end with a user message
  const run = async (history: Message[]) => {
    const reply = make('assistant', '');
    add(reply);
    setFailed(false);
    setStreaming(true);
    const ctrl = (abort.current = new AbortController());
    try {
      await streamChat(history, (d) => patch(reply.id, (c) => c + d), ctrl.signal);
    } catch {
      // Stopped by the user: keep the partial reply. Otherwise drop it so Retry can resend cleanly.
      if (!ctrl.signal.aborted) {
        remove(reply.id);
        setFailed(true);
      }
    } finally {
      setStreaming(false);
    }
  };

  const send = (override?: string) => {
    const content = (override ?? text).trim();
    if (!content || streaming) return;
    const user = make('user', content);
    const history = [...messages].reverse().concat(user);
    add(user);
    setText('');
    run(history);
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      {messages.length === 0 ? (
        <EmptyChat onPick={send} />
      ) : (
        <FlatList
          inverted
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.md }}
          renderItem={({ item, index }) => (
            <MessageBubble message={item} typing={streaming && index === 0 && !item.content} />
          )}
        />
      )}
      {failed && (
        <View style={styles.error}>
          <Text style={[type.small, { color: colors.danger, flex: 1 }]}>Couldn't get a reply.</Text>
          <Pressable
            onPress={() => run([...messages].reverse())}
            accessibilityRole="button"
            style={[styles.retry, { backgroundColor: colors.surface }]}
          >
            <Text style={[type.body, { color: colors.text }]}>Retry</Text>
          </Pressable>
        </View>
      )}
      <ChatInput value={text} onChange={setText} onSend={() => send()} onStop={() => abort.current?.abort()} streaming={streaming} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md },
  retry: { minHeight: 44, minWidth: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
});
