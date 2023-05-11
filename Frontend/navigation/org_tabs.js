import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import OrganizationProfilePage from '../screens/organizationProfilePage';
import CreatePage from '../screens/createPage';

const Tab = createBottomTabNavigator();

export const OrgTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Profile"  // This sets the initial screen to be OrganizationProfilePage
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#BDE3FF',
          height: 70, 
            paddingTop: 15, 
            paddingBottom: 15, 
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
      <Tab.Screen name="Profile" component={OrganizationProfilePage} options= {{title: "My profile", ...headerStyle, headerLeft: null}}/>
      <Tab.Screen name="Create" component={CreatePage} options= {{title: "Create Eventure", ...headerStyle, headerLeft: null}}/>
    </Tab.Navigator>
  );
};

const headerStyle = {
    headerTintColor: 'black',
    headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
    headerStyle: { backgroundColor: '#B8E3FF' },
    headerTitleAlign: 'center',
    headerBackTitle: null,
    headerBackImage: () => (
        <Ionicons
          name="chevron-back"
          size={30}
          color="black"
          style={{ marginLeft: 10 }}
        />
      ),
};
