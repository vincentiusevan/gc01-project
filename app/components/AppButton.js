import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../theme/colors';

export function AppButton({ title, onPress, type = 'primary', style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        type === 'secondary' ? styles.secondary : styles.primary,
        pressed && (type === 'secondary' ? styles.secondaryPressed : styles.primaryPressed),
        style,
      ]}
    >
      <AppText variant="button" style={type === 'secondary' ? styles.secondaryText : null}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: { backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.primary },
  primaryPressed: { backgroundColor: colors.primaryPressed },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  secondaryPressed: { backgroundColor: colors.cardElevated },
  secondaryText: { color: colors.text },
});
