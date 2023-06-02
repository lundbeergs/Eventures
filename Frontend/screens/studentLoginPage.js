import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import GlobalStyles from "../global-style";
import eventures from "../assets/images/eventures.png";
import PurpleButton from "../components/PurpleButton";
import Header from "../components/Header";
import PopUpModal from "../components/PopUpModal";
import { API_BASE_URL } from "../axios.js";

export default function StudentLoginPage() {
  const [popUpModalVisible, setPopUpModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
  }, []);

  const storeAccessTokenInStorage = async (token) => {
    try {
      console.log("Access: " + token);
      await AsyncStorage.setItem("accessToken", token);
    } catch (error) {
      console.log("Error storing accesstoken in storage:", error);
    }
  };

  const storeUserTypeInStorage = async (userType) => {
    console.log("UserType: " + userType);
    await AsyncStorage.setItem("userType", userType);
  };

  const storeRefreshTokenInStorage = async (token) => {
    try {
      console.log("Refresh: " + token);
      await AsyncStorage.setItem("refreshToken", token);
    } catch (error) {
      console.log("Error storing refreshtoken in storage:", error);
    }
  };

  const removeTokenFromStorage = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
    } catch (error) {
      console.log("Error removing token from storage:", error);
    }
  };

  const getProfile = async (accessToken) => {
    try {
      const response = await API_BASE_URL.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: userProfile } = response.data;

      if (userProfile && userProfile.length > 0) {
        const { first_name, last_name, allergies, id } = userProfile[0];
        await AsyncStorage.setItem("firstName", first_name);
        await AsyncStorage.setItem("lastName", last_name);
        await AsyncStorage.setItem("allergies", allergies);
        await AsyncStorage.setItem("studentId", id);
        console.log("Data saved in AsyncStorage.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loginHandler = async () => {
    try {
      const response = await API_BASE_URL.post("/api/signin/", {
        email: email,
        password: password,
      });
      const { access, refresh, user_type } = response.data;

      if (!access || !refresh) {
        throw new Error("Tokens not found in response data");
      }
      storeUserTypeInStorage(user_type);
      storeRefreshTokenInStorage(refresh);
      storeAccessTokenInStorage(access);

      if (user_type == "is_student"){ 
        getProfile(access);
        navigation.navigate("HomeStackStudent", { userData: jwtDecode(access) });
        }
        else {
          setError("You are not a student!")
          togglePopUpModal();
        }
    } catch (error) {
      console.log("Error logging in:", error);
      setError("Wrong email or password. Please try again!");
      removeTokenFromStorage();
      togglePopUpModal();
    }
  };

  const togglePopUpModal = () => {
    setPopUpModalVisible(!popUpModalVisible);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />

      <Image style={GlobalStyles.eventuresImage} source={eventures}></Image>

      <View style={styles.contentContainer}>
        <Header text={"Sign In"} />

        <View style={GlobalStyles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={"grey"}
            style={GlobalStyles.inputText}
            value={email}
            onChangeText={setEmail}
          ></TextInput>
        </View>

        <View style={GlobalStyles.inputContainer}>
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={"grey"}
            style={GlobalStyles.inputText}
            value={password}
            onChangeText={setPassword}
          ></TextInput>
        </View>

        <PurpleButton onPress={loginHandler} text={"Sign In"} />
        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text> Forgot Password </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 40,
          marginTop: "10%",
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        <View>
          <Text style={styles.newUserText}>New to eventures?</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
      </View>

      <PopUpModal
        isVisible={popUpModalVisible}
        text={error}
        buttonText={"OK"}
        closeModal={togglePopUpModal}
      />

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate("StudentSignUp")}
      >
        <Text style={{ fontSize: 20, color: "#0D99FF", fontWeight: 500 }}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BDE3FF",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: 10,
    marginBottom: 20,
    marginHorizontal: "8%",
  },
  newUsersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  contentContainer: {
    marginTop: 20,
    paddingHorizontal: "8%",
  },
  newUserText: {
    fontSize: 18,
    fontWeight: "400",
    paddingHorizontal: 8,
    textAlign: "center",
  },
  forgotPasswordButton: {
    marginTop: 10,
    color: "grey",
  },
  signInButton: {
    marginTop: 20,
    justifyContent: "center",
    alignSelf: "center",
  },
  modalContainer: {
    marginTop: "10%",
    marginHorizontal: 40,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#6B48D3",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  outerModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
