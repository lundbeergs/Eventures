import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../axios.js";
import GlobalStyles from "../global-style.js";
import PurpleButton from "../components/PurpleButton.js";

const StudentSignUp = () => {
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
          allergies: allergies,
        },
      };
      const response = await API_BASE_URL.post("/api/signup/student/", body);
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
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView style={styles.contentContainer} >
          <View style={styles.inputContainer}>
            <View style={GlobalStyles.inputComponent}>
              <Text style={styles.inputHeader}>First name</Text>
              <TextInput
                placeholder="First name..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
                onChangeText={(text) => setFirstName(text)}
              ></TextInput>
            </View>
            <View style={GlobalStyles.inputComponent}>
              <Text style={styles.inputHeader}>Last name</Text>
              <TextInput
                placeholder="Last name..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
                onChangeText={(text) => setLastName(text)}
              ></TextInput>
            </View>
            <View style={GlobalStyles.inputComponent}>
              <Text style={styles.inputHeader}>Email</Text>
              <TextInput
                placeholder="Email..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
                onChangeText={(text) => setEmail(text)}
              ></TextInput>
            </View>
            <View style={GlobalStyles.inputComponent}>
              <Text style={styles.inputHeader}>Password</Text>
              <TextInput
                placeholder="Password..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
                onChangeText={(text) => setPassword(text)}
              ></TextInput>
            </View>
            <View style={GlobalStyles.inputComponent}>
              <Text style={styles.inputHeader}>Re enter password</Text>
              <TextInput
                placeholder="Re enter password..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
              ></TextInput>
            </View>
            <View style={GlobalStyles.inputComponent}>
              <Text style={styles.inputHeader}>Allergies</Text>
              <TextInput
                placeholder="Allergies..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
                onChangeText={(text) => setAllergies(text)}
              ></TextInput>
            </View>
          </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
            <PurpleButton onPress={handleSubmit} text={"Sign Up"} />
          </View>
    </SafeAreaView>
  );
};

export default StudentSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B8E3FF",
  },
  contentContainer: {
    flex: 1,
  },
  
  inputModalContainer: {
    width: "100%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: '8%',
    bottom: '2%'
  },
  inputHeader: {
    marginVertical: "1%",
    fontWeight: 400,
  },
});
