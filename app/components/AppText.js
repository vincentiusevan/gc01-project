import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function AppText({ children, variant = 'body', style }) {
  return <Text style={[styles.base, styles[variant], style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: { color: colors.text },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: 0.2 },
  heading: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  muted: { fontSize: 14, color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '700', color: '#fff', textAlign: 'center' },
});
