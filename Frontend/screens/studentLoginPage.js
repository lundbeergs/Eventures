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

import GlobalStyles from "../global-style";
import eventures from "../assets/images/eventures.png";
import PurpleButton from "../components/PurpleButton";
import Header from "../components/Header";
import PopUpModal from "../components/PopUpModal";
import userInfo from "../userData";

import { API_BASE_URL } from '../axios.js';

export default function StudentLoginPage() {
  const [popUpModalVisible, setPopUpModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [allergies, setAllergies] = useState("");
  const [error, setError] = useState("");
  //const userInfo = {userinfo_first_name: first_name, userinfo_last_name: last_name, userinfo_phone_number: phone_number, userinfo_allergies: allergies, userinfo_token: token};
  const [token, setToken] = useState("");
  
  const navigation = useNavigation();

  const loginHandler = async (isStudent) => {
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
       // automatically fetch profile data after login
      await getProfile(token);
      userInfo.userinfo_token = token;
      navigation.navigate('HomeStackStudent', {userData: userInfo});
    } catch (error) {
      console.log(error);
      console.log("Invalid email or password");
      togglePopUpModal();
      setError("There was an error processing your request.");
    }
  };

  const getProfile = async (token) => {
    try {
      const response = await API_BASE_URL.get(
        `/api/profile/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // replace state.userToken with the retrieved token
          },
        }
      );
      console.log(response.data);
      const { data } = response.data;
      if (data && data.length > 0) {
        const { first_name, last_name, phone_number, allergies } = data[0];
        setFirstName(first_name);
        setLastName(last_name);
        setPhoneNumber(phone_number);
        setAllergies(allergies)
        userInfo.userinfo_first_name = first_name;
        userInfo.userinfo_last_name = last_name;
        userInfo.userinfo_phone_number = phone_number;
        userInfo.userinfo_allergies = allergies;
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

      <PopUpModal
        isVisible={popUpModalVisible}
        text="Invalid email or password. Please try again!"
        buttonText={"OK"}
        closeModal={togglePopUpModal}
      />

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate("TestLoginPage", {userData: userInfo})}
      >
        <Text style={{ fontSize: 20, color: "#0D99FF", fontWeight: 500 }}> Sign Up </Text>
      </TouchableOpacity>
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

/*import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  SafeAreaView,
  Modal,
  Button
} from "react-native";
import { useState } from "react";
import { TabActions, useNavigation } from "@react-navigation/native";
import { users } from "../data/user";

import GlobalStyles from "../global-style";
import backArrow from "../assets/images/backArrow.png";
import eventures from "../assets/images/eventures.png";
import ForgotPassword from "../components/firstPageComp/ForgotPassword";
import EmailSent from "../components/firstPageComp/EmailSent";

export default function StudentLoginPage() {
  const [enteredEmailText, setEnteredEmailText] = useState("");
  const [enteredPasswordText, setEnteredPasswordText] = useState("");
  const [error, setError] = useState("");

  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [emailSentModalVisible, setEmailSentModalVisible] = useState(false);
  const navigation = useNavigation();

  const [modal1Visible, setModal1Visible] = useState(false);
  const [user, setUser] = useState(null);

  const toggleModal1 = () => {
    setModal1Visible(!modal1Visible);
  };

  const toggleForgotPasswordModal = () => {
    setForgotPasswordModalVisible(!forgotPasswordModalVisible);
  };

  const toggleEmailSentModal = () => {
    setEmailSentModalVisible(!emailSentModalVisible);
  };

  const switchModal = () => {
    toggleEmailSentModal();
    toggleForgotPasswordModal();
  };

  function emailHandler(enteredEmailText) {
    console.log(enteredEmailText);
    setEnteredEmailText(enteredEmailText);
  }

  function passwordHandler(enteredPasswordText) {
    console.log(enteredPasswordText);
    setEnteredPasswordText(enteredPasswordText);
  }

  function signInHandler() {
    const foundUser = users.find(
      (user) =>
        user.email === enteredEmailText && user.password === enteredPasswordText
        
    );
    if (foundUser) {
      console.log("success");
      navigation.navigate("HomePageStudent");
    } else {
      console.log("error");
      toggleModal1();
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.topOfPage} />

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("FirstPage")}
        >
          <Image style={GlobalStyles.backArrow} source={backArrow} />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={GlobalStyles.header}> Student Account </Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      <Image style={styles.image} source={eventures}></Image>

      <View style={styles.contentContainer}>
        <Text style={GlobalStyles.header}> Sign In </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={"grey"}
            style={GlobalStyles.inputText}
            onChangeText={emailHandler}
            value={enteredEmailText}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={"grey"}
            style={GlobalStyles.inputText}
            onChangeText={passwordHandler}
            value={enteredPasswordText}
          ></TextInput>
          <Pressable
            style={({ pressed }) => [
              GlobalStyles.button,
              pressed && { opacity: 0.8 },
              ,
            ]}
            onPress={signInHandler}
          >
            <Text style={GlobalStyles.buttonText}>Sign In</Text>
          </Pressable>

      <Modal isVisible={modal1Visible} transparent={true}
        visible={modal1Visible}
        onRequestClose={toggleModal1}
        statusBarTranslucent={true}
        >
        <View style={styles.outerModalContainer}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Invalid email or password</Text>
          <TouchableOpacity style={styles.modalButton} onPress={toggleModal1}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
        </View>
      </Modal>
      

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={toggleForgotPasswordModal}
          >
            <Text> Forgot Password </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ForgotPassword
        visible={forgotPasswordModalVisible}
        onBack={toggleForgotPasswordModal}
        onConfirm={switchModal}
      />
      <EmailSent
        visible={emailSentModalVisible}
        onCancel={toggleEmailSentModal}
      />

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
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate("TestLoginPage")}
      >
        <Text style={{ fontSize: 20, color: "#0D99FF" }}> Sign Up </Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    width: "auto",
    flex: 2,
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
  image: {
    height: 225,
    width: 225,
    alignSelf: "center",
    borderRadius: 125,
    marginTop: "4%",
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
    marginTop: '10%',
    marginHorizontal: 40,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#6B48D3',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});*/
