import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';
import AuthContext from '../contexts/AuthContext';

export function ProfileScreen() {
  const authContext = useContext(AuthContext);
  const followers = ['dudut123', 'mentor_gc1', 'sarah'];
  const followings = ['vincsevan', 'reactnative'];

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    authContext.setIsSignIn(false);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <AppText variant="heading">E</AppText>
          </View>

          <AppText variant="heading">Evan</AppText>
          <AppText variant="muted">@demo_user</AppText>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AppText variant="heading">{followers.length}</AppText>
              <AppText variant="muted">Followers</AppText>
            </View>
            <View style={styles.statItem}>
              <AppText variant="heading">{followings.length}</AppText>
              <AppText variant="muted">Following</AppText>
            </View>
          </View>
        </View>

        <View style={styles.listCard}>
          <AppText variant="body" style={styles.sectionTitle}>
            Followers
          </AppText>
          <AppText variant="muted">{followers.join(', ')}</AppText>
        </View>

        <View style={styles.listCard}>
          <AppText variant="body" style={styles.sectionTitle}>
            Following
          </AppText>
          <AppText variant="muted">{followings.join(', ')}</AppText>
        </View>

        <AppButton title="Logout" type="secondary" onPress={handleLogout} />
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
  profileCard: {
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
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  listCard: {
    backgroundColor: colors.card,
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
