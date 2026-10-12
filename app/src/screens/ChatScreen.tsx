import { randomUUID } from 'expo-crypto';
import { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message, streamChat } from '../api/chat';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import { spacing, useTheme } from '../theme';

// shortcut: state is local; the chat store (next roadmap item) replaces it.
export default function ChatScreen() {
  const { colors } = useTheme();
  const conversationId = useRef(randomUUID()).current;
  const [messages, setMessages] = useState<Message[]>([]); // newest first, for the inverted list
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
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
    setMessages((m) => [reply, user, ...m]);
    setText('');
    setStreaming(true);
    const patch = (fn: (c: string) => string) =>
      setMessages((m) => m.map((x) => (x.id === reply.id ? { ...x, content: fn(x.content) } : x)));
    const ctrl = (abort.current = new AbortController());
    try {
      await streamChat(history, (d) => patch((c) => c + d), ctrl.signal);
    } catch {
      // Stopped by the user: keep the partial reply.
      if (!ctrl.signal.aborted) patch((c) => c || 'Something went wrong. Please try again.');
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
