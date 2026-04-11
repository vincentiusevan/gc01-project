import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gql } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

const SEARCH_USER = gql`
  query SearchUser($query: String) {
    searchUser(query: $query) {
      _id
      name
      username
      email
      followers {
        _id
      }
    }
  }
`;

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      content
      tags
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

export function SearchUnifiedScreen() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('users');
  const navigation = useNavigation();

  const [searchUser, { data, loading, error }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: 'network-only',
  });
  const { data: postData, loading: postLoading, error: postError } = useQuery(GET_POSTS);

  const handleSearch = () => {
    if (mode === 'users') {
      searchUser({
        variables: { query: query.trim() },
      });
    }
  };

  const results = data?.searchUser || [];
  const allPosts = postData?.getPosts || [];
  const postResults = allPosts.filter((post) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const contentMatch = post.content?.toLowerCase().includes(q);
    const tagMatch = (post.tags || []).some((tag) => tag?.toLowerCase().includes(q));
    const authorMatch = post.author?.username?.toLowerCase().includes(q);
    return contentMatch || tagMatch || authorMatch;
  });

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable style={styles.avatarBtn} onPress={() => navigation.navigate('ProfileScreen')}>
            <AppText variant="body" style={styles.avatarBtnText}>
              P
            </AppText>
          </Pressable>
          <AppText variant="heading">Search</AppText>
          <View style={styles.headerRight} />
        </View>

        <AppText variant="muted" style={styles.subtitle}>
          Search by user or post content
        </AppText>

        <View style={styles.modeTabs}>
          <Pressable
            style={[styles.modeTab, mode === 'users' && styles.modeTabActive]}
            onPress={() => setMode('users')}
          >
            <AppText variant="body" style={mode === 'users' ? styles.modeTextActive : null}>
              Users
            </AppText>
          </Pressable>
          <Pressable
            style={[styles.modeTab, mode === 'posts' && styles.modeTabActive]}
            onPress={() => setMode('posts')}
          >
            <AppText variant="body" style={mode === 'posts' ? styles.modeTextActive : null}>
              Posts
            </AppText>
          </Pressable>
        </View>

        <View style={styles.searchCard}>
          <View style={styles.searchInputRow}>
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <AppInput
              placeholder={mode === 'users' ? 'Search by name or username' : 'Search by post content or tags'}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              onSubmitEditing={handleSearch}
              style={styles.searchInput}
            />
          </View>
          {mode === 'users' ? (
            <AppButton title={loading ? 'Searching...' : 'Search'} onPress={handleSearch} type="secondary" />
          ) : null}
        </View>

        {mode === 'users' && error ? <AppText variant="muted">{error.message}</AppText> : null}
        {mode === 'posts' && postError ? <AppText variant="muted">{postError.message}</AppText> : null}

        {mode === 'users' ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => navigation.navigate('UserDetailScreen', { userId: item._id, user: item })}
              >
                <View style={styles.userTop}>
                  <View style={styles.avatar}>
                    <AppText variant="body" style={styles.avatarText}>
                      {(item.name?.[0] || item.username?.[0] || '?').toUpperCase()}
                    </AppText>
                  </View>
                  <View style={styles.userInfo}>
                    <AppText variant="body" style={styles.name}>
                      {item.name}
                    </AppText>
                    <AppText variant="body" style={styles.username}>
                      @{item.username}
                    </AppText>
                    <AppText variant="muted">{item.followers?.length || 0} followers</AppText>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <AppText variant="muted">No users found</AppText>
              </View>
            }
          />
        ) : (
          <FlatList
            data={postResults}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => navigation.navigate('PostDetailScreen', { postId: item._id, post: item })}
              >
                <View style={styles.userTop}>
                  <View style={styles.avatar}>
                    <AppText variant="body" style={styles.avatarText}>
                      {(item.author?.name?.[0] || item.author?.username?.[0] || '?').toUpperCase()}
                    </AppText>
                  </View>
                  <View style={styles.userInfo}>
                    <AppText variant="body" style={styles.name}>
                      {item.author?.name || 'Unknown'}
                    </AppText>
                    <AppText variant="body" style={styles.username}>
                      @{item.author?.username || 'unknown'}
                    </AppText>
                    <AppText variant="body" numberOfLines={2}>
                      {item.content}
                    </AppText>
                    <AppText variant="muted">
                      {item.comments?.length || 0} comments - {item.likes?.length || 0} likes
                    </AppText>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <AppText variant="muted">{postLoading ? 'Loading posts...' : 'No posts found'}</AppText>
              </View>
            }
          />
        )}
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
  subtitle: {
    marginTop: -2,
    marginBottom: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#1d9bf033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtnText: {
    color: colors.primary,
    fontWeight: '700',
  },
  headerRight: {
    width: 34,
  },
  modeTabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  modeTabActive: {
    backgroundColor: colors.cardElevated,
  },
  modeTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  searchCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    gap: 10,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  searchInput: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#1d9bf033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
  },
  username: {
    color: colors.primary,
    marginVertical: 4,
  },
  emptyState: {
    marginTop: 20,
    alignItems: 'center',
  },
});
