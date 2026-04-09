import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Pressable } from 'react-native';

const users = [
  { id: 'u1', name: 'Evan', username: 'vincsevan' },
  { id: 'u2', name: 'Dudut', username: 'dudut123' },
  { id: 'u3', name: 'Mentor', username: 'mentor_gc1' },
];

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(users);
  const navigation = useNavigation();

  const handleSearch = () => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      setResults(users);
      return;
    }
    setResults(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(keyword) || user.username.toLowerCase().includes(keyword)
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SearchScreen</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by name / username"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search User" onPress={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('UserDetailScreen', { user: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>@{item.username}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginTop: 8 },
  name: { fontWeight: '700' },
});
