import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

const dummyPosts = [
  { id: '1', content: 'Hello from Day 3', username: 'evan' },
  { id: '2', content: 'Belajar React Navigation', username: 'dudut' },
  { id: '3', content: 'Screen + navigation dulu', username: 'mentor' },
];

export function HomeScreen() {
  const navigation = useNavigation();

  const handleOpenPostDetail = (post) => {
    navigation.navigate('PostDetailScreen', { post });
  };

  const handleOpenUserDetail = (username) => {
    navigation.navigate('UserDetailScreen', { username });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen - List Posts</Text>
      <FlatList
        data={dummyPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => handleOpenPostDetail(item)}>
            <Text style={styles.content}>{item.content}</Text>
            <Pressable onPress={() => handleOpenUserDetail(item.username)}>
              <Text style={styles.author}>@{item.username}</Text>
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 8 },
  content: { fontSize: 16, marginBottom: 6 },
  author: { color: '#1e88e5', fontWeight: '600' },
});
