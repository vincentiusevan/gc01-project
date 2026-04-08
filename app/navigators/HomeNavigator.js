import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import UserNavigator from './UserNavigator';

const Tab = createBottomTabNavigator();

export default function HomeNavigator({ setAccessToken }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="CreatePostScreen" component={CreatePostScreen} />
      <Tab.Screen name="PostDetailScreen" component={PostDetailScreen} />
      <Tab.Screen name="SearchScreen" component={SearchScreen} />
      <Tab.Screen name="ProfileScreen">
        {(props) => <ProfileScreen {...props} setAccessToken={setAccessToken} />}
      </Tab.Screen>

      <Tab.Screen name="UserNavigator" component={UserNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
