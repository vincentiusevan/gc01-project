import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppText } from '../components/AppText';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { colors } from '../theme/colors';

const REGISTER = gql`
  mutation Register($newUser: RegisterInput) {
    register(newUser: $newUser)
  }
`;

export function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [register, { loading }] = useMutation(REGISTER, {
    onCompleted: (result) => {
      Alert.alert('Success', result?.register || 'Register success');
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert('Register Error', error.message);
    },
  });

  const handleRegister = () => {
    if (!name || !username || !email || !password) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    register({
      variables: {
        newUser: { name, username, email, password },
      },
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppText variant="title" style={styles.brand}>
          EX
        </AppText>
        <AppText variant="muted" style={styles.subheading}>
          Join the conversation, share your thoughts.
        </AppText>

        <View style={styles.authCard}>
          <AppText variant="heading" style={styles.heading}>
            Create your account
          </AppText>

          <AppInput placeholder="Name" value={name} onChangeText={setName} />
          <AppInput placeholder="Username" value={username} onChangeText={setUsername} />
          <AppInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <AppInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <AppButton title={loading ? 'Loading...' : 'Register'} onPress={handleRegister} />
          <AppButton title="Back to Login" type="secondary" onPress={() => navigation.goBack()} />
        </View>

        <AppText variant="muted" style={styles.footNote}>
          Create an account to follow people and join discussions.
        </AppText>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
  brand: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 4,
  },
  subheading: {
    textAlign: 'center',
    marginBottom: 14,
    fontSize: 15,
  },
  authCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18,
    gap: 13,
  },
  heading: {
    textAlign: 'left',
    marginBottom: 8,
    fontSize: 28,
  },
  footNote: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
  },
});
