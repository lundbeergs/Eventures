import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyProfilePage from '../screens/myProfilePage';
import {Ionicons} from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import OrganizationProfilePage from '../screens/organizationProfilePage';
import CreatePage from '../screens/createPage';

const HomeStack = createStackNavigator();

function OrgStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
        <HomeStack.Screen name='OrgTabs' component={CreatePage} />
        </HomeStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

export const OrgTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Profile"  // This sets the initial screen to be OrganizationProfilePage
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#BDE3FF',
        },
        tabBarActiveTintColor: 'black',
        tabBarIcon: ({ focused, color, size }) => {
          let IconName;
          if (route.name === 'Create') {
            IconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            IconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={IconName} size={focused ? 35 : size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Profile" component={OrganizationProfilePage} />
      <Tab.Screen name="Create" component={OrgStackScreen} />
    </Tab.Navigator>
  );
};
