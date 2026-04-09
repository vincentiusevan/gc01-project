import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export function UserDetailScreen({ route, navigation }) {
  const user = route.params?.user;
  const username = user?.username || route.params?.username || 'unknown-user';

  return (
    <View style={styles.container}>
      <Text>UserDetailScreen</Text>
      <Text style={{ fontSize: 18 }}>username: @{String(username)}</Text>
      <Button title="Follow" onPress={() => Alert.alert('Success', `Follow @${username}`)} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
});
