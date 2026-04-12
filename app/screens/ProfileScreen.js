import { useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, View, StyleSheet, ScrollView } from 'react-native';
import { gql } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';
import AuthContext from '../contexts/AuthContext';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config/cloudinary';

const SEARCH_USER = gql`
  query SearchUser($query: String) {
    searchUser(query: $query) {
      _id
      name
      username
      email
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      _id
      name
      username
      email
      followers {
        _id
        username
      }
      followings {
        _id
        username
      }
    }
  }
`;

export function ProfileScreen() {
  const authContext = useContext(AuthContext);
  const [savedUsername, setSavedUsername] = useState('');
  const [activeList, setActiveList] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const [searchUser, { data: searchData, loading: searchLoading, error: searchError }] =
    useLazyQuery(SEARCH_USER);

  useEffect(() => {
    const loadUsername = async () => {
      const username = (await SecureStore.getItemAsync('username')) || '';
      const imageUrl = (await SecureStore.getItemAsync('profile_image_url')) || '';
      setSavedUsername(username);
      setProfileImage(imageUrl);
      if (username) {
        searchUser({ variables: { query: username } });
      }
    };

    loadUsername();
  }, [searchUser]);

  const matchedUser = useMemo(() => {
    const users = searchData?.searchUser || [];
    return (
      users.find((user) => user.username?.toLowerCase() === savedUsername.toLowerCase()) ||
      users[0] ||
      null
    );
  }, [searchData, savedUsername]);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
    refetch,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: matchedUser?._id },
    skip: !matchedUser?._id,
  });

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('username');
    authContext.setIsSignIn(false);
  };

  const uploadProfileImage = async (image) => {
    const data = new FormData();
    data.append('file', {
      uri: image.uri,
      type: image.mimeType || 'image/jpeg',
      name: image.fileName || 'profile-image.jpg',
    });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: data,
      },
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result?.error?.message || 'Upload profile image failed');

    return result.secure_url;
  };

  const handleEditProfile = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow gallery access to update profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled) return;

      setUploading(true);
      const imageUrl = await uploadProfileImage(result.assets[0]);
      await SecureStore.setItemAsync('profile_image_url', imageUrl);
      setProfileImage(imageUrl);
      Alert.alert('Success', 'Profile photo updated.');
    } catch (errorUpload) {
      Alert.alert('Edit Profile Error', errorUpload.message || 'Failed to update profile photo');
    } finally {
      setUploading(false);
    }
  };

  if (searchLoading || userLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <AppText variant="muted">Loading profile...</AppText>
        </View>
      </ScreenWrapper>
    );
  }

  if (searchError || userError) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <AppText variant="muted">{searchError?.message || userError?.message}</AppText>
          <AppButton
            title="Retry"
            type="secondary"
            onPress={() => {
              if (matchedUser?._id) {
                refetch();
              } else if (savedUsername) {
                searchUser({ variables: { query: savedUsername } });
              }
            }}
          />
          <AppButton title="Logout" type="secondary" onPress={handleLogout} />
        </View>
      </ScreenWrapper>
    );
  }

  const user = userData?.getUserById;
  const followers = user?.followers || [];
  const followings = user?.followings || [];

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
        <AppText variant="heading">Profile</AppText>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <AppText variant="heading">{user?.name?.[0] || 'E'}</AppText>
            )}
          </View>

          <AppText variant="heading" style={styles.nameText}>
            {user?.name || 'Unknown User'}
          </AppText>
          <AppText variant="muted" style={styles.usernameText}>
            @{user?.username || '-'}
          </AppText>

          <Pressable
            style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}
            onPress={handleEditProfile}
            disabled={uploading}
          >
            <AppText variant="body" style={styles.editButtonText}>
              {uploading ? 'Uploading...' : 'Edit Profile'}
            </AppText>
          </Pressable>

          <View style={styles.statsRow}>
            <Pressable
              style={({ pressed }) => [styles.statItem, pressed && styles.buttonPressed]}
              onPress={() => setActiveList(activeList === 'followers' ? '' : 'followers')}
            >
              <AppText variant="heading">{followers.length}</AppText>
              <AppText variant="muted">Followers</AppText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.statItem, pressed && styles.buttonPressed]}
              onPress={() => setActiveList(activeList === 'followings' ? '' : 'followings')}
            >
              <AppText variant="heading">{followings.length}</AppText>
              <AppText variant="muted">Following</AppText>
            </Pressable>
          </View>
        </View>

        {activeList ? (
          <View style={styles.listCard}>
            <AppText variant="body" style={styles.sectionTitle}>
              {activeList === 'followers' ? 'Followers' : 'Following'}
            </AppText>
            <AppText variant="muted">
              {(activeList === 'followers' ? followers : followings).length
                ? (activeList === 'followers' ? followers : followings)
                    .map((userFollow) => `@${userFollow.username}`)
                    .join(', ')
                : '-'}
            </AppText>
          </View>
        ) : null}

        <AppButton title="Logout" type="secondary" onPress={handleLogout} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    flex: 1,
    gap: 12,
    paddingTop: 8,
    paddingBottom: 18,
  },
  profileCard: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderRadius: 0,
    paddingHorizontal: 4,
    paddingBottom: 14,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#1d9bf033',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  nameText: {
    marginTop: 2,
  },
  usernameText: {
    marginTop: -2,
  },
  editButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 9,
    marginTop: 10,
  },
  editButtonText: {
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.65,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 28,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  listCard: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  sectionTitle: {
    fontWeight: '700',
  },
});
