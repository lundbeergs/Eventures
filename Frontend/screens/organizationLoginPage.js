import React, { useState, useEffect } from "react";
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

import axios from "axios";
import GlobalStyles from "../global-style";
import eventures from "../assets/images/eventures.png";
import PurpleButton from "../components/PurpleButton";
import Header from "../components/Header";
import PopUpModal from "../components/PopUpModal";

import { API_BASE_URL } from '../axios.js'

export default function OrganizationLoginPage() {
  const [popUpModalVisible, setPopUpModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [org_name, setOrgName] = useState('');
  const [org_bio, setOrgBio] = useState('');
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const orgData = {orgName: org_name, orgBio: org_bio}
  const navigation = useNavigation();

  const loginHandler = async (isOrganization) => {
    try {
      const body = {
        email: email,
        password: password,
      };
      const response = await API_BASE_URL.post(`/api/signin/`, body);
      const { token } = response.data;
      if (!token) {
        throw new Error("Token not found in response data");
      }
      console.log("success");
      console.log(token);
      setToken(token);
      await getProfile(token); // automatically fetch profile data after login
      console.log(orgData)
      navigation.navigate("HomePageOrganization", {orgData: orgData});
    } catch (error) {
      console.log(error);
      togglePopUpModal();
      setError("There was an error processing your request.");
    }
  };

  const getProfile = async (token) => {
    try {
      const response = await API_BASE_URL.get(`/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`, // replace state.userToken with the retrieved token
        },
      });
      console.log(response.data);
      const { data } = response.data;
      if (data && data.length > 0) {
        const { org_name, org_bio } = data[0];
        setOrgName(org_name);
        setOrgBio(org_bio);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getProfile(token);
    }
  }, [token]);

  const togglePopUpModal = () => {
    setPopUpModalVisible(!popUpModalVisible);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />

      <Image style={GlobalStyles.eventuresImage} source={eventures}></Image>

      <View style={styles.contentContainer}>
        <Header text={"Sign In"} />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={"grey"}
            style={GlobalStyles.inputText}
            value={email}
            onChangeText={setEmail}
          ></TextInput>
        </View>

        <View style={styles.inputContainer}>
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
          marginTop: 20,
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
        text="Invalid email or password. Please try again!"
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
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: 10,
    marginBottom: 20,
    marginHorizontal: 40,
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
    paddingHorizontal: 40,
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
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
