import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';

export function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Content is required');
      return;
    }

    Alert.alert('Success', 'Create post UI complete for Day 3');
    setContent('');
    setTags('');
    setImgUrl('');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText variant="heading" style={styles.title}>
          Create Post
        </AppText>
        <AppText variant="muted" style={styles.subtitle}>
          Share your thoughts on EX
        </AppText>

        <AppInput
          placeholder="What's happening?"
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.textArea}
        />
        <AppInput placeholder="Tags (comma separated)" value={tags} onChangeText={setTags} />
        <AppInput
          placeholder="Image URL"
          value={imgUrl}
          onChangeText={setImgUrl}
          autoCapitalize="none"
        />

        <AppButton title="Post" onPress={handleSubmit} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    paddingTop: 8,
  },
  title: {
    marginTop: 8,
  },
  subtitle: {
    marginBottom: 8,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});
