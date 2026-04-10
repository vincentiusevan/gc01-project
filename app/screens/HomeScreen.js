import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      createdAt
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
        <View style={styles.header}>
          <AppText variant="title" style={styles.title}>
            EX
          </AppText>
          <AppText variant="muted" style={styles.subtitle}>
            For you
          </AppText>
        </View>

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
              <View style={styles.rowTop}>
                <Pressable style={styles.avatar} onPress={() => handleOpenUserDetail(item.author)}>
                  <AppText variant="body" style={styles.avatarText}>
                    {(item.author?.name?.[0] || item.author?.username?.[0] || '?').toUpperCase()}
                  </AppText>
                </Pressable>

                <View style={styles.contentWrap}>
                  <Pressable onPress={() => handleOpenUserDetail(item.author)}>
                    <View style={styles.userRow}>
                      <AppText variant="body" style={styles.name}>
                        {item.author?.name || 'Unknown'}
                      </AppText>
                      <AppText variant="muted" style={styles.username}>
                        @{item.author?.username || 'unknown'}
                      </AppText>
                    </View>
                  </Pressable>

                  <AppText variant="body" style={styles.content}>
                    {item.content || '-'}
                  </AppText>

                  <View style={styles.actionRow}>
                    <View style={styles.actionItem}>
                      <Ionicons name="chatbubble-outline" size={16} color={colors.textMuted} />
                      <AppText variant="muted" style={styles.actionText}>
                        {item.comments?.length || 0}
                      </AppText>
                    </View>
                    <View style={styles.actionItem}>
                      <Ionicons name="heart-outline" size={16} color={colors.textMuted} />
                      <AppText variant="muted" style={styles.actionText}>
                        {item.likes?.length || 0}
                      </AppText>
                    </View>
                    <View style={styles.actionItem}>
                      <Ionicons name="share-social-outline" size={16} color={colors.textMuted} />
                    </View>
                  </View>
                </View>
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
  header: {
    paddingTop: 6,
    paddingBottom: 12,
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
    fontSize: 40,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    paddingTop: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 4,
    paddingVertical: 14,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#1d9bf033',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  avatarText: {
    fontWeight: '700',
    color: colors.primary,
  },
  contentWrap: {
    flex: 1,
    gap: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontWeight: '700',
  },
  username: {
    fontSize: 14,
  },
  content: {
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 18,
    marginTop: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
  },
});
