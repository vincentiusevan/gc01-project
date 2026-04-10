import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function AppInput({ style, ...props }) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.textMuted}
      selectionColor={colors.primary}
      cursorColor={colors.primary}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
});
