import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

export function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handleSubmit = () => {
    if (!content) {
      Alert.alert('Error', 'Content is required');
      return;
    }
    Alert.alert('Success', 'Create Post UI complete for Day 3');
    setContent('');
    setTags('');
    setImgUrl('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CreatePostScreen</Text>
      <TextInput
        style={styles.input}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput style={styles.input} placeholder="Tags (comma separated)" value={tags} onChangeText={setTags} />
      <TextInput style={styles.input} placeholder="Image URL" value={imgUrl} onChangeText={setImgUrl} />
      <Button title="Add Post" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
});
