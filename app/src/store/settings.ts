import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  mode: 'dark' | 'light';
  onboarded: boolean;
  setMode: (m: 'dark' | 'light') => void;
  finishOnboarding: () => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      mode: 'dark',
      onboarded: false,
      setMode: (mode) => set({ mode }),
      finishOnboarding: () => set({ onboarded: true }),
    }),
    { name: 'settings', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
