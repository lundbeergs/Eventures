import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from '../axios.js';

const TestLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const body = {
        email: email,
        password: password,
        profile: {
        first_name: first_name,
        last_name: last_name,
        allergies: allergies}
      };
      const response = await API_BASE_URL.post(
        '/api/signup/student/',
        body
      );
      const state = {
        userToken: response.data.token, // assuming the API returns a token
      };
      navigation.navigate("StudentLoginPage"); // navigate to the home screen after successful authentication
    } catch (error) {
      console.log(error);
      setError("There was an error processing your request.");
    }
  };

  return (
    <View style={{ margin: 40 }}>
      <Text>Register</Text>
      {error ? <Text>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        placeholder="Last name"
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        placeholder="Allergies"
        onChangeText={(text) => setAllergies(text)}
      />
      <Button title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default TestLoginPage;



// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:8000";

// const TestLoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [first_name, setFirstName] = useState("");
//   const [last_name, setLastName] = useState("");
//   const [phone_number, setPhoneNumber] = useState("");
//   const [allergies, setAllergies] = useState("");
//   const [error, setError] = useState("");

//   const navigation = useNavigation();

//    const handleSubmit = async () => {
//     const config = {
//       headers: { Authorization: 'Bearer ${state.userToken}}' } };
//     }

//     const body = {
//       email: email,
//       password: password,
//       first_name: first_name,
//       last_name: last_name,
//       phone_number: phone_number,
//       allergies: allergies
//     }
//     axios.post('http://127.0.0.1:8000/api/signup/student', body)
//     .then(response => {
//       console.log(response.data)
//     })
//     .catch(error => {
//       console.log(error);
//     })

//   return (
//     <View style = {{margin: 40}}>
//       <Text>Register</Text>
//       {error ? <Text>{error}</Text> : null}
//       <TextInput placeholder="Email" onChangeText={(text) => setEmail(text)} />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry={true}
//         onChangeText={(text) => setPassword(text)}
//       />
//       <TextInput
//         placeholder="First Name"
//         secureTextEntry={true}
//         onChangeText={(text) => setFirstName(text)}
//       />
//       <TextInput
//         placeholder="Last name"
//         secureTextEntry={true}
//         onChangeText={(text) => setLastName(text)}
//       />
//       <TextInput
//         placeholder="Phone Number"
//         secureTextEntry={true}
//         onChangeText={(text) => setPhoneNumber(text)}
//       />
//       <TextInput
//         placeholder="Allergies"
//         secureTextEntry={true}
//         onChangeText={(text) => setAllergies(text)}
//       />
//       <TouchableOpacity onPress={handleSubmit(email, password, first_name, last_name, phone_number, allergies)}>
//         <Text>Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default TestLoginPage;

// /*import {
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   TouchableOpacity,
//   Image,
//   Pressable,
//   SafeAreaView,
//   Modal,
// } from "react-native";
// import { useState } from "react";
// import { useNavigation } from "@react-navigation/native";
// import { ScrollView } from "react-native-gesture-handler";
// import { MultipleSelectList } from "react-native-dropdown-select-list";
// import React from "react";
// import GlobalStyles from "../global-style";
// import backArrow from "../assets/images/backArrow.png";


// export default function TestLoginPage() {
//   const navigation = useNavigation();
  
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rePassword, setRePassword] = useState("");
//   const [city, setCity] = useState("");
//   const [foodPreferences, setFoodPreferences] = useState("");
//   const [drinkpreferences, setDrinkPreferences] = React.useState([])

//   function handleSignUp() {


//   };

//   const [select, setSelected] = React.useState([]);

//   const data = [
//     { id: 1, value: "Beer" },
//     { id: 2, value: "Cider" },
//     { id: 3, value: "White wine" },
//     { id: 4, value: "Red wine" },
//     { id: 5, value: "Alcohol free" },
//   ];

//   return (
//     <SafeAreaView style={GlobalStyles.container}>
//       <View style={GlobalStyles.topOfPage} />

//       <View style={{ flexDirection: "row" }}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           onPress={() => navigation.navigate("StudentLoginPage")}
//         >
//           <Image style={GlobalStyles.backArrow} source={backArrow} />
//         </TouchableOpacity>
//         <View style={styles.headerContainer}>
//           <Text style={GlobalStyles.header}> Create Profile </Text>
//         </View>
//         <View style={{ flex: 1 }} />
//       </View>

//       <ScrollView style={styles.contentContainer}>
//         <View style={styles.inputContainer}>
//           <View style={styles.inputComponent}>
//             <Text style={styles.inputHeader}>First name</Text>
//             <TextInput
//               placeholder="First name..."
//               placeholderTextColor={"grey"}
//               style={GlobalStyles.inputText}
//               value={firstName}
//               onChangeText={(text) => setFirstName(text)}
//             ></TextInput>
//           </View>

//           <View style={styles.inputComponent}>
//             <Text style={styles.inputHeader}>Last name</Text>
//             <TextInput
//               placeholder="Last name..."
//               placeholderTextColor={"grey"}
//               style={GlobalStyles.inputText}
//               value={lastName}
//               onChangeText={(text) => setLastName(text)}
//             ></TextInput>
//           </View>

//           <View style={styles.inputComponent}>
//             <Text style={styles.inputHeader}>Email</Text>
//             <TextInput
//               placeholder="Email..."
//               placeholderStyle={styles.placeholderStyle}
//               style={GlobalStyles.inputText}
//               value={email}
//               onChangeText={(text) => setEmail(text)}
//             ></TextInput>
//           </View>

//           <View style={styles.inputComponent}>
//             <Text style={styles.inputHeader}>Password</Text>
//             <TextInput
//               placeholder="Password..."
//               placeholderTextColor={"grey"}
//               style={GlobalStyles.inputText}
//               value={password}
//               onChangeText={(text) => setPassword(text)}
//             ></TextInput>
//           </View>

//           <View style={styles.inputComponent}>
//             <Text style={styles.inputHeader}>Re enter password</Text>
//             <TextInput
//               placeholder="Re enter password..."
//               placeholderTextColor={"grey"}
//               style={GlobalStyles.inputText}
//             ></TextInput>
//           </View>

//           <View style={styles.inputComponent}>
//             <Text style={styles.inputHeader}>City </Text>
//             <TextInput
//               placeholder="City"
//               placeholderStyle={styles.placeholderStyle}
//               style={GlobalStyles.inputText}
//               value={city}
//               onChangeText={(text) => setCity(text)}
//             ></TextInput>
//           </View>

//           <View style={styles.inputComponent}>
//             <Text style={styles.inputHeader}> Food preferences </Text>
//             <TextInput
//               placeholder="Food preferences"
//               placeholderStyle={styles.placeholderStyle}
//               style={GlobalStyles.inputText}
//               value={foodPreferences}
//               onChangeText={(text) => setFoodPreferences(text)}
//             ></TextInput>
//           </View>

//           <View style={styles.inputComponent}>
//             <Text style={styles.inputHeader}>Drink preferences</Text>
//             <MultipleSelectList
//               setDrinkPreferences={(val) => setDrinkPreferences(val)}
//               data={data}
//               search={false}
//               label="Choosen drink preferences"
//               labelStyles={{ fontWeight: "regular" }}
//               badgeStyles={{ backgroundColor: "#6B48D3", color: "white" }}
//               placeholder="Choose drink preferences"
//               style
//               rowBack
//               boxStyles={{
//                 backgroundColor: "white",
//                 borderColor: "white",
//                 borderRadius: 4,
//               }}
//               dropdownStyles={{
//                 backgroundColor: "white",
//                 borderColor: "white",
//                 borderRadius: 4,
//               }}
//               checkBoxStyles={{ color: "grey" }}
//             />
//           </View>
//         </View>

//         <View style={styles.buttonContainer}>
//           <Pressable
//             style={({ pressed }) => [
//               GlobalStyles.button,
//               pressed && { opacity: 0.8 },
//             ]}
//             onPress={handleSignUp}
//           >
//             <Text style={GlobalStyles.buttonText}> Sign Up </Text>
//           </Pressable>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#B8E3FF",
//   },
//   headerContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//     width: "auto",
//     flex: 2,
//   },
//   contentContainer: {
//     marginTop: "1%",

//     flex: 1,
//   },
//   inputComponent: {
//     width: "100%",
//     marginTop: 10,
//     paddingHorizontal: 40,
//   },
//   inputModalContainer: {
//     width: "100%",
//     marginTop: 10,
//   },
//   buttonContainer: {
//     width: "100%",
//     paddingHorizontal: 40,
//     marginBottom: 20,
//   },
//   inputHeader: {
//     marginVertical: "1%",
//     fontWeight: 400,
//   },
// });
// */