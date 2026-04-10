import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { GET_POSTS } from './HomeScreen';

const ADD_POST = gql`
  mutation AddPost($newPost: PostInput) {
    addPost(newPost: $newPost)
  }
`;

export function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const [addPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    awaitRefetchQueries: true,
    onCompleted: (result) => {
      Alert.alert('Success', result?.addPost || 'Post created');
      setContent('');
      setTags('');
      setImgUrl('');
      navigation.navigate('HomeScreen');
    },
    onError: (error) => {
      Alert.alert('Create Post Error', error.message);
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Content is required');
      return;
    }

    const parsedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    addPost({
      variables: {
        newPost: {
          content: content.trim(),
          tags: parsedTags,
          imgUrl: imgUrl.trim(),
        },
      },
    });
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

        <AppButton title={loading ? 'Posting...' : 'Post'} onPress={handleSubmit} />
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
