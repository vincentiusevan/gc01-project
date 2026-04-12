import { useState } from 'react';
import { View, StyleSheet, Alert, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import * as ImagePicker from 'expo-image-picker';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';
import { GET_POSTS } from './HomeScreen';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config/cloudinary';

const ADD_POST = gql`
  mutation AddPost($newPost: PostInput) {
    addPost(newPost: $newPost)
  }
`;

export function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [addPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    awaitRefetchQueries: true,
    onCompleted: (result) => {
      Alert.alert('Success', result?.addPost || 'Post created');
      setContent('');
      setTags('');
      setImage(null);
      navigation.navigate('MainTabs', { screen: 'HomeScreen' });
    },
    onError: (error) => {
      Alert.alert('Create Post Error', error.message);
    },
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!image) return '';

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary config is required');
    }

    const data = new FormData();
    data.append('file', {
      uri: image.uri,
      type: image.mimeType || 'image/jpeg',
      name: image.fileName || 'post-image.jpg',
    });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: data,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error?.message || 'Upload image failed');
    }

    return result.secure_url;
  };

  const handleSubmit = async () => {
    if (loading || uploading) return;

    if (!content.trim()) {
      Alert.alert('Error', 'Content is required');
      return;
    }

    const parsedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      setUploading(true);
      const uploadedImageUrl = await uploadImage();

      await addPost({
        variables: {
          newPost: {
            content: content.trim(),
            tags: parsedTags,
            imgUrl: uploadedImageUrl,
          },
        },
      });
    } catch (error) {
      Alert.alert('Create Post Error', error.message);
    } finally {
      setUploading(false);
    }
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
          {image ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <Pressable style={styles.removeImageBtn} onPress={() => setImage(null)}>
                <Ionicons name="close" size={18} color={colors.white} />
              </Pressable>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable style={styles.imageBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={20} color={colors.primary} />
              <AppText variant="body" style={styles.imageBtnText}>
                Add image
              </AppText>
            </Pressable>
            <AppButton
              style={styles.postBtn}
              title={loading || uploading ? 'Posting...' : 'Post'}
              onPress={handleSubmit}
            />
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
  imageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageBtnText: {
    color: colors.primary,
    fontWeight: '700',
  },
  postBtn: {
    minWidth: 120,
  },
  previewWrap: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    backgroundColor: colors.bgSoft,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#00000099',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
