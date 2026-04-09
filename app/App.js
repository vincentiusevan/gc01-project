import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApolloProvider } from '@apollo/client/react';
import * as SecureStore from 'expo-secure-store';

import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import HomeNavigator from './navigators/HomeNavigator';
import client from './config/apollo';
import AuthContext from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      setIsSignIn(!!token);
      setIsReady(true);
    };

    bootstrap();
  }, []);

  if (!isReady) return null;

  return (
    <AuthContext.Provider value={{ isSignIn, setIsSignIn }}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isSignIn ? (
              <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
            ) : (
              <>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}
