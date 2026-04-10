import { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import * as SecureStore from 'expo-secure-store';

import AuthContext from '../contexts/AuthContext';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';

const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password)
  }
`;

export function LoginScreen({ navigation }) {
  const authContext = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: async (result) => {
      const token = result?.login;
      if (!token) {
        Alert.alert('Login Error', 'Token not found from server response');
        return;
      }
      await SecureStore.setItemAsync('access_token', token);
      await SecureStore.setItemAsync('username', username);
      authContext.setIsSignIn(true);
    },
    onError: (error) => {
      Alert.alert('Login Error', error.message);
    },
  });

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Validation', 'Username and password are required');
      return;
    }

    login({
      variables: {
        username,
        password,
      },
    });
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

        <AppButton title={loading ? 'Loading...' : 'Login'} onPress={handleLogin} />
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
