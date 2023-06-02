import {
  StyleSheet,
  View,
  TextInput,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Pressable
} from "react-native";
import { useState } from "react";
import eventures from "../assets/images/eventures.png";

import ForgotPassword from "./ForgotPassword"

function SignInInput(props) {
  const [enteredEmailText, setEnteredEmailText] = useState("");
  const [enteredPasswordText, setEnteredPasswordText] = useState("");

  const [modal2Visible, setModal2Visible] = useState(false);

  const toggleModal2 = () => {
    setModal2Visible(!modal2Visible);
  }

  function emailHandler(enteredEmailText) {
    setEnteredEmailText(enteredEmailText);
  }

  function passwordHandler(enteredPasswordText) {
    setEnteredPasswordText(enteredPasswordText);
  }

  function signInHandler() {
    props.onSignIn(enteredEmailText, enteredPasswordText);
    setEnteredEmailText("");
    setEnteredPasswordText("");
  }

  return (
    
    <Modal visible={props.visible} animationType="fade">
      <ForgotPassword
      visible={modal2Visible}
      onCancel={toggleModal2}
      />

      <View style={styles.Container}>
        <Text style={styles.thisPageHeader}> Student Account </Text>
        <TouchableOpacity onPress={props.onCancel}>
          <Image
            style={styles.goBackImage}
            source={require("../goBack.png")}
          ></Image>
        </TouchableOpacity>

        <Image
          style={styles.image}
          source={require("../firstPageComp/eventures.png")}
        ></Image>

        <View style={styles.contentContainer}>
          <Text style={styles.headerText}> Sign In </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={'grey'}
              style={styles.inputText}
              onChangeText={emailHandler}
              value={enteredEmailText}
            ></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={'grey'}
              style={styles.inputText}
              onChangeText={passwordHandler}
              value={enteredPasswordText}
            ></TextInput>
          </View>

          <Pressable style={({pressed})=>[styles.button, pressed && {opacity: .8}]} onPress={signInHandler} >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>

          <TouchableOpacity style={styles.forgotPassword} onPress={toggleModal2}>
            <Text> Forgot Password </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

export default SignInInput;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#bde3ff",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  thisPageHeader: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 25,
  },
  forgotPassword: {
    marginTop: 10,
    color: 'grey'
  },
  contentContainer: {
    padding: 40,
  },
  image: {
    height: 225,
    width: 225,
    alignSelf: "center",
    borderRadius: 125,
    marginTop: 86,
  },
  goBackImage: {
    position: "absolute",
    width: 40,
    height: 40,
    marginTop: 20,
    marginLeft: 25,
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
  },
  inputText: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 4,
  },
  buttonContainer: {
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    width: "100%",
    height: 45,
    marginTop: 20,
    backgroundColor: '#6B48D3',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'white'
  },
});