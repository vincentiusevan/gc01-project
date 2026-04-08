import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Button } from 'react-native';

export function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Button
        title="Go to User Detail"
        onPress={() =>
          navigation.navigate('UserNavigator', {
            screen: 'UserDetailScreen',
            params: { userId: '12345' },
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
