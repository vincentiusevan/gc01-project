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
    backgroundColor: colors.bgSoft,
    color: colors.text,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    lineHeight: 22,
  },
});
