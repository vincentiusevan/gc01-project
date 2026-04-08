import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from '../screens/SearchScreen';
import { UserDetailScreen } from '../screens/UserDetailScreen';

const Stack = createNativeStackNavigator();

export default function UserNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchScreenStack" component={SearchScreen} />
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
    </Stack.Navigator>
  );
}
