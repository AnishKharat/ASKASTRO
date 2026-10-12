import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Message } from '../api/chat';

type ChatState = {
  conversationId: string;
  messages: Message[]; // newest first, for the inverted list
  streaming: boolean;
  add: (...m: Message[]) => void; // pass in display order, newest first
  patch: (id: string, fn: (content: string) => string) => void;
  setStreaming: (s: boolean) => void;
  clear: () => void;
};

export const useChat = create<ChatState>()(
  persist(
    (set) => ({
      conversationId: randomUUID(),
      messages: [],
      streaming: false,
      add: (...m) => set((s) => ({ messages: [...m, ...s.messages] })),
      patch: (id, fn) =>
        set((s) => ({ messages: s.messages.map((x) => (x.id === id ? { ...x, content: fn(x.content) } : x)) })),
      setStreaming: (streaming) => set({ streaming }),
      clear: () => set({ messages: [], conversationId: randomUUID() }),
    }),
    {
      name: 'chat',
      storage: createJSONStorage(() => AsyncStorage),
      // Skip empty replies (app killed mid-request) and transient streaming state.
      partialize: (s) => ({ conversationId: s.conversationId, messages: s.messages.filter((m) => m.content) }),
    },
  ),
);
