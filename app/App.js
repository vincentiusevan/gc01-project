import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import HomeNavigator from './navigators/HomeNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [accessToken, setAccessToken] = useState('');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!accessToken ? (
          <>
            <Stack.Screen name="LoginScreen">
              {(props) => <LoginScreen {...props} setAccessToken={setAccessToken} />}
            </Stack.Screen>
            <Stack.Screen name="RegisterScreen">
              {(props) => <RegisterScreen {...props} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="HomeNavigator">
            {(props) => <HomeNavigator {...props} setAccessToken={setAccessToken} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
