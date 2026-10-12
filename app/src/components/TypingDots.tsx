import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { spacing, useTheme } from '../theme';

export default function TypingDots() {
  const { colors } = useTheme();
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    const loops = dots.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(v, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.3, duration: 350, useNativeDriver: true }),
          Animated.delay((2 - i) * 160),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [dots]);

  return (
    <View style={styles.row} accessibilityLabel="AskAstro is typing">
      {dots.map((v, i) => (
        <Animated.View key={i} style={[styles.dot, { backgroundColor: colors.brand, opacity: v }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs, paddingVertical: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
