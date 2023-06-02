import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import HomePageStudent from '../screens/homePageStudent';
import SearchPage from '../screens/searchPage';
import TicketPage from '../screens/ticketPage';
import MyProfilePage from '../screens/myProfilePage';
import EventPage from '../screens/eventPage';
import OrganizationPage from '../screens/organizationPage';
import EditStudentProfileScreen from '../screens/editStudentProfile';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeStack = createStackNavigator();
const MyProfileStack = createStackNavigator();
const SearchStack = createStackNavigator();

function HomeStackScreen() {
    const navigation = useNavigation();
   
    return (
        <HomeStack.Navigator initialRouteName="HomePageStudent" screenOptions={{headerShown: true}}>
        <HomeStack.Screen name='HomePageStudent' component={HomePageStudent}
        options= {{title: "Following", ...studentHomePageStyle, headerLeft: null}}/>
        <HomeStack.Screen name='EventPage' component={EventPage} options= {{title: "", ...headerStyle}}/>
        <HomeStack.Screen name='OrganizationPage' component={OrganizationPage} 
         options= {{title: "Organization page", ...headerStyle}}/>
        </HomeStack.Navigator>
    );
}

function MyProfileScreen() {

    return (
        <MyProfileStack.Navigator >
            <MyProfileStack.Screen name="MyProfilePage" component={MyProfilePage} 
            options= {{title: "My Profile", ...headerStyle, headerLeft: null}} />

            <MyProfileStack.Screen name="EditStudentProfilePage" component={EditStudentProfileScreen} 
            options= {{title: "Edit Profile", ...headerStyle}}/>
        </MyProfileStack.Navigator>
    );
}

function SearchStackScreen() {
    return (
        <SearchStack.Navigator screenOptions={{headerShown: true}}>
            <SearchStack.Screen name="SearchPage" component={SearchPage} options={{headerShown: true, ...headerStyle, title: '', headerLeft: null}}/>
            <SearchStack.Screen name='EventPage' component={EventPage} options= {{title: "", ...headerStyle}}/>
            <SearchStack.Screen name='OrganizationPage' component={OrganizationPage} 
            options= {{title: "Organization page", ...headerStyle}}/>
        

        </SearchStack.Navigator>
    )
};


const Tab = createBottomTabNavigator();

export const HomeTabs = () => {

  return (
    <Tab.Navigator 
    screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
            backgroundColor: '#BDE3FF',
            height: 80, 
            paddingBottom: 15, 
        },
        tabBarActiveTintColor: 'black',
        tabBarIcon: ({focused, color, size}) => {
            let IconName; 
            if (route.name === 'Home') {
                IconName = focused ? 'home' : 'home-outline'
            }
            else if (route.name === 'Search') {
                IconName = focused ? 'search' : 'search-outline'
            }
            else if (route.name === 'Tickets') {
                IconName = focused ? 'qr-code' : 'qr-code-outline'
            }
            else if (route.name === 'ProfileStack') {
                IconName = focused ? 'person' : 'person-outline'
            }
            return <Ionicons name={IconName} size={focused? 35: size} color={color}/>
        }
    })}>
        
      <Tab.Screen name="Home" component={HomeStackScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Search" component={SearchStackScreen} options={{headerShown: false}} />
      <Tab.Screen name="Tickets" component={TicketPage} options= {{title: "My Tickets", ...headerStyle, headerLeft: null}}/>
      <Tab.Screen name="ProfileStack" component={MyProfileScreen} options={{headerShown: false}}
      />

    </Tab.Navigator>
  );
}

const studentHomePageStyle = {
    headerTintColor: 'black',
    headerTitleStyle: { fontWeight: '300', fontSize: 20, borderBottomWidth: 1,
    borderBottomColor: 'black', paddingHorizontal: 20}, 
    headerStyle: { backgroundColor: '#bde3ff' },
    headerTitleAlign: 'center',
    headerBackTitle: null,
  };

const headerStyle = {
    headerTintColor: 'black',
    headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
    headerStyle: { backgroundColor: '#bde3ff' },
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


