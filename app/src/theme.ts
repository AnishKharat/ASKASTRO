import { useSettings } from './store/settings';

const palette = {
  midnight: '#0F1B3D', navy: '#1B2A5C', trustBlue: '#3B5BDB', periwinkle: '#8FA5FF',
  indigo: '#6C63C7', indigoDeep: '#5A55B0', lavender: '#B3ADF0', gold: '#E0B95C', goldDeep: '#8A6418',
  mist: '#F6F7FB', cloud: '#E6E9F2', ink: '#1E2433', slate: '#6B7280', haze: '#A0A8C3',
  starlight: '#EDEFFA', teal: '#5FD3BC', tealDeep: '#16705F', rose: '#EF8A8A', roseDeep: '#B94444',
  white: '#FFFFFF',
};

const dark = {
  background: palette.midnight, surface: palette.navy, text: palette.starlight,
  textMuted: palette.haze, primary: palette.trustBlue, onPrimary: palette.white,
  link: palette.periwinkle, accent: palette.gold, brand: palette.lavender,
  success: palette.teal, danger: palette.rose,
  // decorative: gradient ends and hairline borders
  backgroundEnd: palette.navy, primaryEnd: palette.indigoDeep, border: palette.indigo,
};

const light: typeof dark = {
  background: palette.mist, surface: palette.cloud, text: palette.ink,
  textMuted: palette.slate, primary: palette.trustBlue, onPrimary: palette.white,
  link: palette.trustBlue, accent: palette.goldDeep, brand: palette.indigoDeep,
  success: palette.tealDeep, danger: palette.roseDeep,
  backgroundEnd: palette.cloud, primaryEnd: palette.indigoDeep, border: palette.haze,
};

export const themes = { dark, light };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 16, pill: 999 };
// Body 16px / 1.5 line height per project_context. Fonts are loaded in App.tsx.
export const fonts = { body: 'Inter_400Regular', bold: 'Inter_600SemiBold', heading: 'Lora_600SemiBold' };
export const type = {
  body: { fontSize: 16, lineHeight: 24, fontFamily: fonts.body },
  bodyBold: { fontSize: 16, lineHeight: 24, fontFamily: fonts.bold },
  small: { fontSize: 14, lineHeight: 20, fontFamily: fonts.body },
  title: { fontSize: 24, lineHeight: 32, fontFamily: fonts.heading },
  display: { fontSize: 30, lineHeight: 38, fontFamily: fonts.heading },
};

export const useTheme = () => ({ colors: themes[useSettings((s) => s.mode)] });
