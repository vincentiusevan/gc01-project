import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

export function PostDetailScreen({ route }) {
  const [comment, setComment] = useState('');
  const post = route.params?.post;

  const handleComment = () => {
    if (!comment) {
      Alert.alert('Error', 'Comment is required');
      return;
    }
    Alert.alert('Success', `Comment submitted: ${comment}`);
    setComment('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PostDetailScreen</Text>
      <View style={styles.card}>
        <Text style={styles.content}>{post?.content || 'No post selected'}</Text>
        <Text style={styles.author}>@{post?.username || '-'}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Write a comment"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Comment Post" onPress={handleComment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12 },
  content: { fontSize: 16, marginBottom: 6 },
  author: { color: '#1e88e5', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
});
