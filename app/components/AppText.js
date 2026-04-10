import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function AppText({ children, variant = 'body', style, ...props }) {
  return (
    <Text style={[styles.base, styles[variant], style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  muted: {
    fontSize: 16,
    color: colors.textMuted,
  },
  button: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
});
