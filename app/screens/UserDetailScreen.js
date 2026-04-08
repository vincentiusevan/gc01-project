import { View, Text, StyleSheet, Button } from 'react-native';

export function UserDetailScreen({ route, navigation }) {
  const { userId } = route.params || {};

  return (
    <View style={styles.container}>
      <Text>UserDetailScreen</Text>
      <Text style={{ fontSize: 18 }}>userId: {String(userId)}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
});
