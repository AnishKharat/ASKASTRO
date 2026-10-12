import * as SecureStore from 'expo-secure-store';
import { fetch } from 'expo/fetch';
import type { components } from './types';

export type Message = components['schemas']['Message'];

// Real devices need the PC's LAN IP: set EXPO_PUBLIC_API_URL in app/.env.
const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

async function userId(): Promise<string> {
  let id = await SecureStore.getItemAsync('userId');
  if (!id) {
    const res = await fetch(`${BASE}/v1/session`, { method: 'POST' });
    id = (await res.json()).user_id as string;
    await SecureStore.setItemAsync('userId', id);
  }
  return id;
}

/** POST /v1/chat and call onDelta for each SSE text chunk. Throws on HTTP or stream errors. */
export async function streamChat(
  messages: Message[],
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${BASE}/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': await userId() },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`chat failed (${res.status})`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    buf += decoder.decode(value, { stream: true });
    const events = buf.split('\n\n');
    buf = events.pop()!;
    for (const e of events) {
      const data = e.replace(/^data: /, '');
      if (data === '[DONE]') return;
      const json = JSON.parse(data);
      if (json.error) throw new Error(json.error);
      onDelta(json.delta);
    }
  }
}
