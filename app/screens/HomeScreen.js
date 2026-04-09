import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { colors } from '../theme/colors';

const dummyPosts = [
  { id: '1', content: 'Hello from Day 3', username: 'evan', likes: 12, comments: 3 },
  { id: '2', content: 'Belajar React Navigation', username: 'dudut', likes: 9, comments: 2 },
  { id: '3', content: 'Screen + navigation dulu', username: 'mentor', likes: 21, comments: 8 },
];

export function HomeScreen() {
  const navigation = useNavigation();

  const handleOpenPostDetail = (post) => {
    navigation.navigate('PostDetailScreen', { post });
  };

  const handleOpenUserDetail = (username) => {
    navigation.navigate('UserDetailScreen', { username });
  };

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
          data={dummyPosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handleOpenPostDetail(item)}>
              <Pressable onPress={() => handleOpenUserDetail(item.username)}>
                <AppText variant="body" style={styles.author}>
                  @{item.username}
                </AppText>
              </Pressable>

              <AppText variant="body" style={styles.content}>
                {item.content}
              </AppText>

              <View style={styles.metaRow}>
                <AppText variant="muted">❤ {item.likes}</AppText>
                <AppText variant="muted">💬 {item.comments}</AppText>
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
