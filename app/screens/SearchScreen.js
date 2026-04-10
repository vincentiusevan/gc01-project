import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
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

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();

  const [searchUser, { data, loading, error }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: 'network-only',
  });

  const handleSearch = () => {
    searchUser({
      variables: {
        query: query.trim(),
      },
    });
  };

  const results = data?.searchUser || [];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText variant="heading">Search</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          Find people by name or username
        </AppText>
        <View style={styles.searchCard}>
          <View style={styles.searchInputRow}>
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <AppInput
              placeholder="Search by name or username"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              onSubmitEditing={handleSearch}
              style={styles.searchInput}
            />
          </View>
          <AppButton
            title={loading ? 'Searching...' : 'Search'}
            onPress={handleSearch}
            type="secondary"
          />
        </View>
        {error ? <AppText variant="muted">{error.message}</AppText> : null}

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
