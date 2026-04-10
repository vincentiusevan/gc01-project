import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';
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
          Tell the world what is happening
        </AppText>

        <View style={styles.formCard}>
          <View style={styles.composerHead}>
            <View style={styles.avatar}>
              <AppText variant="body" style={styles.avatarText}>
                Y
              </AppText>
            </View>
            <AppText variant="muted">Share something with your followers</AppText>
          </View>

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

          <View style={styles.actions}>
            <Ionicons name="image-outline" size={20} color={colors.primary} />
            <AppButton style={styles.postBtn} title={loading ? 'Posting...' : 'Post'} onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    paddingTop: 8,
  },
  title: {
    marginTop: 4,
  },
  subtitle: {
    marginBottom: 4,
  },
  formCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  composerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#1d9bf033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '700',
  },
  textArea: {
    minHeight: 140,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  actions: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postBtn: {
    minWidth: 120,
  },
});
