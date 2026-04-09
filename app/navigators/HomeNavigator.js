import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { UserDetailScreen } from '../screens/UserDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ setAccessToken }) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="CreatePostScreen" component={CreatePostScreen} />
      <Tab.Screen name="SearchScreen" component={SearchScreen} />
      <Tab.Screen name="ProfileScreen">
        {(props) => <ProfileScreen {...props} setAccessToken={setAccessToken} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function HomeNavigator({ setAccessToken }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
        {(props) => <MainTabs {...props} setAccessToken={setAccessToken} />}
      </Stack.Screen>
      <Stack.Screen
        name="PostDetailScreen"
        component={PostDetailScreen}
        options={{ headerShown: true, title: 'Post Detail' }}
      />
      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{ headerShown: true, title: 'User Detail' }}
      />
    </Stack.Navigator>
  );
}
