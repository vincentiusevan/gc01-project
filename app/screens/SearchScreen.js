import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
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
        <AppText variant="heading">Search Users</AppText>
        <AppInput
          placeholder="Search by name or username"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          onSubmitEditing={handleSearch}
        />
        <AppButton title={loading ? 'Searching...' : 'Search'} onPress={handleSearch} type="secondary" />
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
              <AppText variant="body" style={styles.name}>
                {item.name}
              </AppText>
              <AppText variant="body" style={styles.username}>
                @{item.username}
              </AppText>
              <AppText variant="muted">{item.followers?.length || 0} followers</AppText>
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
    gap: 12,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
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
