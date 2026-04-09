import { View, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

export function UserDetailScreen({ route, navigation }) {
  const user = route.params?.user;
  const username = user?.username || route.params?.username || 'unknown-user';
  const name = user?.name || 'Unknown User';
  const followers = user?.followers ?? Math.floor(Math.random() * 500) + 20;

  const handleFollow = () => {
    Alert.alert('Success', `Followed @${username}`);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <AppText variant="heading">{name[0]}</AppText>
          </View>

          <AppText variant="heading">{name}</AppText>
          <AppText variant="muted">@{username}</AppText>
          <AppText variant="muted">{followers} followers</AppText>
        </View>

        <AppButton title="Follow" onPress={handleFollow} />
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
