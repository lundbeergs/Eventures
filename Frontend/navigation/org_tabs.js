import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import OrganizationProfilePage from "../screens/organizationProfilePage";
import CreatePage from "../screens/createPage";
import RequestPage from "../screens/requestPage";
import MemberPage from "../screens/memberPage";
import myEventuresOrgPage from "../screens/myEventuresOrgPage";
import OrgEventPage from '../screens/orgEventPage';
import EditEventPage from '../screens/editEventPage';
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const OrganizationProfileStack = createStackNavigator();
const MyEventuresOrgStack = createStackNavigator()

function MyEventuresOrgScreen() {
  return (
    
  <MyEventuresOrgStack.Navigator screenOptions={{ headerShown: true }}>
    <MyEventuresOrgStack.Screen
        name="MyEventuresOrgPage"
        component={myEventuresOrgPage}
        options={{ title: "My Eventures", ...headerStyle, headerLeft: null }}
      />
  <OrganizationProfileStack.Screen name="OrgEventPage" component = {OrgEventPage} options= {{title: "", ...headerStyle}}/>
  <OrganizationProfileStack.Screen name="EditEventPage" component = {EditEventPage} options= {{title: "Edit Eventure", ...headerStyle}}/>
  </MyEventuresOrgStack.Navigator>
  )
}

function OrganizationProfileScreen() {
  return (
    <OrganizationProfileStack.Navigator screenOptions={{ headerShown: true }}>
      <OrganizationProfileStack.Screen
        name="Profile"
        component={OrganizationProfilePage}
        options={{ title: "My Profile", ...headerStyle, headerLeft: null }}
      />
      <OrganizationProfileStack.Screen
        name="Requests"
        component={RequestPage}
        options={{ title: "Membership Requests", ...headerStyle }}
      />
       <OrganizationProfileStack.Screen
        name="Members"
        component={MemberPage}
        options={{ title: "Members", ...headerStyle }}
      />
    </OrganizationProfileStack.Navigator>
  );
}

export const OrgTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Profile" // This sets the initial screen to be OrganizationProfilePage
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#BDE3FF",
          height: 80,
          paddingBottom: 15,
        },
        tabBarActiveTintColor: "black",
        tabBarIcon: ({ focused, color, size }) => {
          let IconName;
          if (route.name === "MyEventuresOrg") {
            IconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Create") {
            IconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "ProfileStack") {
            IconName = focused ? "person" : "person-outline";
          }
          return (
            <Ionicons
              name={IconName}
              size={focused ? 35 : size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="MyEventuresOrg"
        component={MyEventuresOrgScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Create"
        component={CreatePage}
        options={{ title: "Create Eventure", ...headerStyle, headerLeft: null }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={OrganizationProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const headerStyle = {
  headerTintColor: "black",
  headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
  headerStyle: { backgroundColor: "#bde3ff" },
  headerTitleAlign: "center",
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
