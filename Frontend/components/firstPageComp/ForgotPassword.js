import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";

const ForgotPassword = (props) => {

  return (
      <Modal animationType="slide" transparent={true} visible={props.visible}>
        <View style={styles.Container}>
          <TouchableOpacity onPress={props.onCancel}>
            <Image
              style={styles.goBackImage}
              source={require("../goBack.png")}
            ></Image>
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.header}>Forgot your password?</Text>
              <Text style={styles.descriptionText}>
                Enter your email and we'll send you a link to get back into your
                account.
              </Text>
            </View>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"grey"}
              style={styles.inputText}
            ></TextInput>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.8 },
              ]}
              onPress={props.onCancel}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#B8E3FF",
  },
  contentContainer: {
    marginTop: "20%",
    padding: 40,
  },
  contentContainer2: {
    marginTop: "45%",
    padding: 40,
  },
  textContainer: {
    margin: "8%",
    marginBottom: "20%",
  },
  goBackImage: {
    width: 40,
    height: 40,
    marginTop: 20,
    marginLeft: 25,
  },
  button: {
    width: "100%",
    height: 45,
    marginTop: 20,
    backgroundColor: "#6B48D3",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  inputText: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 4,
  },
  header: {
    fontWeight: "bold",
    lineHeight: 25,
    fontSize: 20,
  },
  descriptionText: {
    lineHeight: 20,
    fontSize: 16,
  },
});
