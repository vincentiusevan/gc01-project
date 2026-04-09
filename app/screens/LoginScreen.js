import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';

export function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) return;
    navigation.replace('HomeNavigator');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText variant="title" style={styles.brand}>
          EX
        </AppText>
        <AppText variant="heading" style={styles.heading}>
          Sign in to EX
        </AppText>

        <AppInput
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <AppInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <AppButton title="Login" onPress={handleLogin} />
        <AppButton
          title="Go to Register"
          type="secondary"
          onPress={() => navigation.navigate('RegisterScreen')}
        />
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
  brand: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 2,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 14,
  },
});
