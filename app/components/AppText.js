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
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  },
  muted: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  button: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
});
