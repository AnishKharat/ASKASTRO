import { randomUUID } from 'expo-crypto';
import { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message, streamChat } from '../api/chat';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import { useChat } from '../store/chat';
import { spacing, useTheme } from '../theme';

export default function ChatScreen() {
  const { colors } = useTheme();
  const { conversationId, messages, streaming, add, patch, setStreaming } = useChat();
  const [text, setText] = useState('');
  const abort = useRef<AbortController | null>(null);

  const make = (role: Message['role'], content: string): Message => ({
    id: randomUUID(), conversationId, role, content, createdAt: new Date().toISOString(),
  });

  const send = async () => {
    const content = text.trim();
    if (!content || streaming) return;
    const user = make('user', content);
    const reply = make('assistant', '');
    const history = [...messages].reverse().concat(user);
    add(reply, user);
    setText('');
    setStreaming(true);
    const ctrl = (abort.current = new AbortController());
    try {
      await streamChat(history, (d) => patch(reply.id, (c) => c + d), ctrl.signal);
    } catch {
      // Stopped by the user: keep the partial reply.
      if (!ctrl.signal.aborted) patch(reply.id, (c) => c || 'Something went wrong. Please try again.');
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
      <ChatInput value={text} onChange={setText} onSend={send} onStop={() => abort.current?.abort()} streaming={streaming} />
    </SafeAreaView>
  );
}
