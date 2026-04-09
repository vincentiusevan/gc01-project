import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../theme/colors';

export function ScreenWrapper({ children, padded = true }) {
  return (
    <LinearGradient colors={gradients.screen} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={[styles.inner, padded && styles.padded]}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },
  inner: { flex: 1 },
  padded: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
});
