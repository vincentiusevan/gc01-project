import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { colors } from '../theme/colors';

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      content
      author {
        _id
        username
        name
      }
      comments {
        content
      }
      likes {
        username
      }
    }
  }
`;

export function HomeScreen() {
  const navigation = useNavigation();
  const { data, loading, error, refetch } = useQuery(GET_POSTS);

  const handleOpenPostDetail = (post) => {
    navigation.navigate('PostDetailScreen', { post });
  };

  const handleOpenUserDetail = (user) => {
    navigation.navigate('UserDetailScreen', { userId: user?._id, user });
  };

  const posts = data?.getPosts || [];

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <AppText variant="muted">Loading posts...</AppText>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <AppText variant="body" style={styles.errorTitle}>
            Failed to load posts
          </AppText>
          <AppText variant="muted">{error.message}</AppText>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <AppText variant="body">Retry</AppText>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText variant="title" style={styles.title}>
          EX
        </AppText>
        <AppText variant="muted" style={styles.subtitle}>
          Home Feed
        </AppText>

        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <AppText variant="muted">No posts yet.</AppText>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handleOpenPostDetail(item)}>
              <Pressable onPress={() => handleOpenUserDetail(item.author)}>
                <AppText variant="body" style={styles.author}>
                  @{item.author?.username || 'unknown'}
                </AppText>
              </Pressable>

              <AppText variant="body" style={styles.content}>
                {item.content || '-'}
              </AppText>

              <View style={styles.metaRow}>
                <AppText variant="muted">Likes {item.likes?.length || 0}</AppText>
                <AppText variant="muted">Comments {item.comments?.length || 0}</AppText>
              </View>
            </Pressable>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  errorTitle: {
    fontWeight: '700',
  },
  retryBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.card,
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    marginTop: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 14,
  },
  emptyState: {
    paddingTop: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  author: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  content: {
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
  },
});
