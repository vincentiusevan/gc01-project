import { useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, View, StyleSheet, ScrollView } from 'react-native';
import { gql } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import * as SecureStore from 'expo-secure-store';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';
import AuthContext from '../contexts/AuthContext';

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

  const [searchUser, { data: searchData, loading: searchLoading, error: searchError }] =
    useLazyQuery(SEARCH_USER);

  useEffect(() => {
    const loadUsername = async () => {
      const username = (await SecureStore.getItemAsync('username')) || '';
      setSavedUsername(username);
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
    fetchPolicy: 'network-only',
  });

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('username');
    authContext.setIsSignIn(false);
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
            <AppText variant="heading">{user?.name?.[0] || 'E'}</AppText>
          </View>

          <AppText variant="heading" style={styles.nameText}>
            {user?.name || 'Unknown User'}
          </AppText>
          <AppText variant="muted" style={styles.usernameText}>
            @{user?.username || '-'}
          </AppText>

          <Pressable
            style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}
            onPress={() => Alert.alert('Edit Profile', 'Feature edit profile belum tersedia.')}
          >
            <AppText variant="body" style={styles.editButtonText}>
              Edit Profile
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
