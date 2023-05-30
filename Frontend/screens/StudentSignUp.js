import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../axios.js";
import GlobalStyles from "../global-style.js";
import PurpleButton from "../components/PurpleButton.js";
import PopUpModal from "../components/PopUpModal.js";
import { Picker } from "@react-native-picker/picker";
import { Switch } from "react-native";


const drinkOptions = [
  "Select drink preference...",
  "Non-alcoholic",
  "Beer & White wine",
  "Beer & Red wine",
  "Cider & White wine",
  "Cider & Red wine",
];


const StudentSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [drinkpref, setDrinkPref] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isRegisteredModalVisible, setIsRegisteredModalVisible] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [gdprChecked, setGdprChecked] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !allergies ||
      !drinkpref ||
      !gdprChecked
    ) {
      setError("Please fill in all the required fields to register!");
      setModalVisible(true);
      return;
    }
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address!");
      setModalVisible(true);
      return;
    }
    if (password !== reenterPassword) {
      setError("Passwords does not match, please try again!");
      setPasswordMatch(false);
      setModalVisible(true);
      return;
    }
    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one number."
      );
      setModalVisible(true);
      return;
    }
    try {
      const body = {
        email: email,
        password: password,
        profile: {
          first_name: first_name,
          last_name: last_name,
          allergies: allergies,
          drinkpref: drinkpref,
        },
      };
      const response = await API_BASE_URL.post("/api/signup/student/", body);
      const state = {
        userToken: response.data.token,
      };
      setMessage("You have registered successfully!");
      setIsRegisteredModalVisible(true);
    } catch (error) {
      console.log(error);
      setError("There was an error processing your request.");
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleReenterPasswordChange = (text) => {
    setReenterPassword(text);
    setPasswordMatch(text === password);
  };

  const isPasswordValid = (password) => {
    if (password.length < 8) {
      return false;
    }
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(password)) {
      return false;
    }
    return true;
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>First name *</Text>
            <TextInput
              placeholder="First name..."
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              onChangeText={(text) => setFirstName(text)}
            ></TextInput>
          </View>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>Last name *</Text>
            <TextInput
              placeholder="Last name..."
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              onChangeText={(text) => setLastName(text)}
            ></TextInput>
          </View>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>Email *</Text>
            <TextInput
              placeholder="Email..."
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              onChangeText={(text) => setEmail(text)}
            ></TextInput>
          </View>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>Password *</Text>
            <TextInput
              placeholder="Password..."
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            ></TextInput>
          </View>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>Re enter password *</Text>
            <TextInput
              placeholder="Re enter password..."
              placeholderTextColor={"grey"}
              style={[
                GlobalStyles.inputText,
                !passwordMatch && styles.inputTextError,
              ]}
              value={reenterPassword}
              onChangeText={handleReenterPasswordChange}
              secureTextEntry={true}
            ></TextInput>
          </View>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>Allergies *</Text>
            <TextInput
              placeholder="Allergies..."
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              onChangeText={(text) => setAllergies(text)}
            ></TextInput>
          </View>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>Drink Preference *</Text>
            <Picker
              selectedValue={drinkpref}
              onValueChange={(itemValue) => setDrinkPref(itemValue)}
              style={styles.drinkInputText}
            >
              {drinkOptions.map((option, index) => (
                <Picker.Item label={option} value={option} key={index} />
              ))}
            </Picker>
          </View>
          <View style={styles.gdprContainer}>
            <Text style={styles.gdprText}>
              I agree to the GDPR terms.
            </Text>
            <Switch
              value={gdprChecked}
              onValueChange={setGdprChecked}
              thumbColor={gdprChecked ? "white" : "white"}
              trackColor={{ false: "lightgray", true: "#6B48D3" }}
            />
          </View>

        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <PurpleButton onPress={handleSubmit} text={"Sign Up"} />
      </View>

      <PopUpModal
        isVisible={modalVisible}
        text={error}
        closeModal={closeModal}
        buttonText="OK"
      />
      <PopUpModal
        isVisible={isRegisteredModalVisible}
        text={message}
        buttonText={"OK"}
        closeModal={() => navigation.navigate("StudentLoginPage")}
      />
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
  inputContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    paddingHorizontal: "4%",
    marginBottom: 10,
  },
  drinkInputText: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  inputModalContainer: {
    width: "100%",
    marginVertical: 10,
  },
  inputTextError: {
    color: "red",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: "8%",
    bottom: "2%",
  },
  inputHeader: {
    marginVertical: "1%",
    fontWeight: 400,
  },
  gdprContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: '4%'
  },
  gdprText: {
    marginRight: 10
  },
  gdprSwitch: {
    alignSelf: 'flex-end'
  }
});