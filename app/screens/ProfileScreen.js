import { View, Text, StyleSheet, Button } from 'react-native';

export function ProfileScreen({ setAccessToken }) {
  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <Button title="Logout" onPress={() => setAccessToken('')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
