import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import GlobalStyles from "../global-style";
import eventures from "../assets/images/eventures.png";
import PurpleButton from "../components/PurpleButton";
import Header from "../components/Header";
import PopUpModal from "../components/PopUpModal";
import { API_BASE_URL } from "../axios.js";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OrganizationLoginPage() {
  const [popUpModalVisible, setPopUpModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

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

      if (user_type == "is_organization") {
        navigation.navigate("HomePageOrganization", {
          userData: jwtDecode(access),
        });
      } else {
        setError("You are not an organization!");
        togglePopUpModal();
      }
    } catch (error) {
      console.log("Error logging in:", error);
      removeTokenFromStorage();
      setError("Invalid email or password. Please try again!");
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

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 14 }}>Contact us at </Text>
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#0D99FF" }}>
          eventures@gmail.com
        </Text>
      </View>

      <PopUpModal
        isVisible={popUpModalVisible}
        text={error}
        buttonText={"OK"}
        closeModal={togglePopUpModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B8E3FF",
  },
  newUsersContainer: {
    margin: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
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
    marginHorizontal: 40,
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
