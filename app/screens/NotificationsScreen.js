import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { colors } from '../theme/colors';

const notifications = [
  { id: 'n1', title: 'New follower', body: '@udin started following you', time: '1m' },
  { id: 'n2', title: 'New comment', body: '@dudut123 commented on your post', time: '6m' },
  { id: 'n3', title: 'New like', body: '@mentor_gc1 liked your post', time: '14m' },
  { id: 'n4', title: 'Mention', body: 'You were mentioned in a post', time: '1h' },
];

export function NotificationsScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.avatarBtn} onPress={() => navigation.navigate('ProfileScreen')}>
            <AppText variant="body" style={styles.avatarText}>
              P
            </AppText>
          </Pressable>
          <AppText variant="heading" style={styles.headerTitle}>
            Notifications
          </AppText>
          <View style={styles.headerRight} />
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
              <View style={styles.itemTextWrap}>
                <AppText variant="body" style={styles.itemTitle}>
                  {item.title}
                </AppText>
                <AppText variant="muted">{item.body}</AppText>
              </View>
              <AppText variant="muted" style={styles.itemTime}>
                {item.time}
              </AppText>
            </View>
          )}
        />

        <Pressable style={styles.fab} onPress={() => navigation.navigate('CreatePostScreen')}>
          <Ionicons name="add" size={30} color={colors.white} />
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#1d9bf033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 24,
  },
  headerRight: {
    width: 34,
  },
  listContent: {
    paddingBottom: 110,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemTextWrap: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontWeight: '700',
  },
  itemTime: {
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 14,
    bottom: 84,
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
