import { View, StyleSheet, Alert } from 'react-native';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      _id
      name
      username
      email
      followers {
        _id
        name
        username
      }
      followings {
        _id
        name
        username
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation Follow($followingId: ID) {
    follow(followingId: $followingId)
  }
`;

export function UserDetailScreen({ route, navigation }) {
  const userId = route.params?.userId || route.params?.user?._id;

  const { data, loading, error, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  });

  const [follow, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    onCompleted: async (result) => {
      await refetch();
      Alert.alert('Success', result?.follow || 'Follow success');
    },
    onError: (err) => Alert.alert('Follow Error', err.message),
  });

  const handleFollow = () => {
    follow({
      variables: { followingId: userId },
    });
  };

  if (!userId) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <AppText variant="muted">User ID not found.</AppText>
          <AppButton title="Go Back" type="secondary" onPress={() => navigation.goBack()} />
        </View>
      </ScreenWrapper>
    );
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <AppText variant="muted">Loading user...</AppText>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <AppText variant="muted">{error.message}</AppText>
          <AppButton title="Retry" type="secondary" onPress={() => refetch()} />
          <AppButton title="Go Back" type="secondary" onPress={() => navigation.goBack()} />
        </View>
      </ScreenWrapper>
    );
  }

  const user = data?.getUserById;
  const username = user?.username || 'unknown-user';
  const name = user?.name || 'Unknown User';
  const followers = user?.followers || [];
  const followings = user?.followings || [];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <AppText variant="heading">{name[0]}</AppText>
          </View>

          <AppText variant="heading">{name}</AppText>
          <AppText variant="muted">@{username}</AppText>
          <AppText variant="muted">{followers.length} followers</AppText>
          <AppText variant="muted">{followings.length} following</AppText>
        </View>

        <AppButton title={followLoading ? 'Following...' : 'Follow'} onPress={handleFollow} />
        <AppButton title="Go Back" type="secondary" onPress={() => navigation.goBack()} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: '#1d9bf033',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
});
