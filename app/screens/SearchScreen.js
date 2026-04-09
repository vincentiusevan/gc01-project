import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

const users = [
  { id: 'u1', name: 'Evan', username: 'vincsevan', followers: 120 },
  { id: 'u2', name: 'Dudut', username: 'dudut123', followers: 86 },
  { id: 'u3', name: 'Mentor', username: 'mentor_gc1', followers: 402 },
];

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(users);
  const navigation = useNavigation();

  const handleSearch = () => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      setResults(users);
      return;
    }

    setResults(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(keyword) || user.username.toLowerCase().includes(keyword)
      )
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText variant="heading">Search Users</AppText>
        <AppInput
          placeholder="Search by name or username"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        <AppButton title="Search" onPress={handleSearch} type="secondary" />

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('UserDetailScreen', { user: item })}
            >
              <AppText variant="body" style={styles.name}>
                {item.name}
              </AppText>
              <AppText variant="body" style={styles.username}>
                @{item.username}
              </AppText>
              <AppText variant="muted">{item.followers} followers</AppText>
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
