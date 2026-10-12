import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { radius, spacing, type, useTheme } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export default function GradientButton({ label, onPress, disabled, accessibilityLabel, style }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.btn, { opacity: disabled ? 0.5 : 1 }, style]}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fill}
      >
        <Text style={[type.bodyBold, { color: colors.onPrimary }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: radius.pill, overflow: 'hidden', minHeight: 44, minWidth: 44 },
  fill: { flex: 1, minHeight: 44, minWidth: 44, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center' },
});
