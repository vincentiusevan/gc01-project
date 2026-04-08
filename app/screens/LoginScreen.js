import { Link } from '@react-navigation/native';
import { View, Text, StyleSheet, Button } from 'react-native';

export function LoginScreen({ setAccessToken }) {
  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
      <Button title="Dummy Login" onPress={() => setAccessToken('dummy-token')} />
      <Link screen="RegisterScreen">Go to Register</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
});
