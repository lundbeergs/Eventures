import { createStackNavigator } from '@react-navigation/stack';
import { HomeTabs } from './tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {TouchableOpacity } from 'react-native';
import FirstPage from '../screens/firstScreen';
import StudentLoginPage from '../screens/studentLoginPage';
import OrganizationLoginPage from '../screens/organizationLoginPage';
import SignUp from '../screens/signUpPage';
import ForgotPasswordScreen from '../screens/forgotPasswordScreen';
import TestLoginPage from '../screens/TestLoginPage';
import { OrgTabs } from './org_tabs';


const Stack = createStackNavigator();


export const FirstStack = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen name="FirstPage" component={FirstPage}
      options={{title: '', headerStyle: {backgroundColor: '#B8E3FF'}}}
      />
      <Stack.Screen name="HomeStackStudent" component={HomeTabs} options={{ headerShown: false }}/>
  
      <Stack.Screen name="HomePageOrganization" component={OrgTabs} />
      <Stack.Screen name="StudentLoginPage" component={StudentLoginPage}
      options={{title: 'Student Account', ...commonHeaderStyle}}/>

      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}
      options={{title: '', ...commonHeaderStyle}}/>

      <Stack.Screen name="OrganizationLoginPage" component={OrganizationLoginPage}
      options={{title: 'Organization Account', ...commonHeaderStyle
      }}/>

      <Stack.Screen name="TestLoginPage" component={TestLoginPage}
      options={{title: 'Register', ...commonHeaderStyle}}/>

      <Stack.Screen name="SignUp" component={SignUp}/>

    </Stack.Navigator>
  );
}

const commonHeaderStyle = {
    headerTintColor: 'black',
    headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
    headerStyle: { backgroundColor: '#B8E3FF' },
    headerTitleAlign: 'center',
    headerBackTitle: '',
    headerBackImage: () => (
      <Ionicons
        name="chevron-back"
        size={30}
        color="black"
        style={{ marginLeft: 10 }}
      />),
  
  };