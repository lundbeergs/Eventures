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

import GlobalStyles from "../../global-style";

const EmailSent = (props) => {

  return (
      <Modal animationType="none" transparent={true} visible={props.visible }>
        <View style={GlobalStyles.modalContainer}>
          <View style={styles.contentContainer}>
          
            <View style={styles.textContainer}>
            <Text style={styles.header}>Email Sent</Text>
              <Text style={styles.descriptionText}>
                We have sent a mail to your inbox. Click on the reset link to
                create a new password!
              </Text>
            </View>
            
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.8 },
              ]}
              onPress={props.onCancel}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
  );
};

export default EmailSent;

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: "20%",
    padding: 40,
  },
  textContainer: {
    margin: "8%",
    marginBottom: "20%",
    marginTop: 61
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



/*import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";

const EmailSent = (props) => {
  return (
    <View>
      <Modal
        animationType="none"
        visible={props.visible}
      >
        <View style={styles.Container}>
          <View style={styles.contentContainer2}>
            <View style={styles.textContainer}>
              <Text style={styles.descriptionText}>
                We have sent a mail to your inbox. Click on the reset link to
                create a new password!
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.buttonText} onPress={props.onCancel}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EmailSent;

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
*/
