import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

// [left %, top %, size, opacity]: fixed positions so the sky doesn't shuffle on re-render.
const STARS = [
  [8, 6, 2, 0.7], [22, 14, 3, 0.5], [41, 5, 2, 0.8], [63, 11, 3, 0.6], [86, 7, 2, 0.7],
  [93, 22, 2, 0.5], [12, 31, 2, 0.5], [34, 27, 3, 0.4], [71, 33, 2, 0.6], [55, 21, 2, 0.4],
  [5, 52, 3, 0.4], [90, 48, 3, 0.5], [47, 58, 2, 0.4], [80, 66, 2, 0.5], [18, 72, 2, 0.5],
  [62, 79, 3, 0.4], [92, 86, 2, 0.6], [30, 90, 2, 0.5], [75, 94, 2, 0.4],
] as const;

/** Gradient background with a faint starfield; wraps every screen. */
export default function Screen({ children, edges = ['top', 'bottom'] }: { children: ReactNode; edges?: Edge[] }) {
  const { colors } = useTheme();
  return (
    <LinearGradient colors={[colors.background, colors.backgroundEnd]} style={styles.fill}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill} importantForAccessibility="no-hide-descendants">
        {STARS.map(([l, t, s, o], i) => (
          <View
            key={i}
            style={{
              position: 'absolute', left: `${l}%`, top: `${t}%`, width: s, height: s,
              borderRadius: s, backgroundColor: colors.accent, opacity: o,
            }}
          />
        ))}
      </View>
      <SafeAreaView edges={edges} style={styles.fill}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
