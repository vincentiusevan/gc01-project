import { View, Text, StyleSheet, Button } from 'react-native';

export function ProfileScreen({ navigation }) {
  const followers = ['dudut123', 'mentor_gc1', 'sarah'];
  const followings = ['vincsevan', 'reactnative'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ProfileScreen</Text>
      <Text>Name: Demo User</Text>
      <Text>Username: @demo_user</Text>
      <Text style={styles.subtitle}>Followers ({followers.length})</Text>
      <Text>{followers.join(', ')}</Text>
      <Text style={styles.subtitle}>Followings ({followings.length})</Text>
      <Text>{followings.join(', ')}</Text>
      <Button title="Back to Login" onPress={() => navigation.navigate('LoginScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontWeight: '700', marginTop: 6 },
});
