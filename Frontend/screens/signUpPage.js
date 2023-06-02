import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  SafeAreaView,
  Modal,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { createUser } from "../data/user";
import { ScrollView } from "react-native-gesture-handler";
import { MultipleSelectList } from "react-native-dropdown-select-list";

import GlobalStyles from "../global-style";
import backArrow from "../assets/images/backArrow.png";
import React from "react";

export default function SignUp() {
  const navigation = useNavigation();
  const [nextStepModalVisible, setNextStepModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const toggleNextStepModal = () => {
    setNextStepModalVisible(!nextStepModalVisible);
  };

  const handleNextStep = () => {
    createUser(firstName, lastName, email, password, rePassword);
    navigation.navigate("StudentLoginPage");
  };

  const [select, setSelected] = React.useState([]);

  const data = [
    { id: 1, value: "Beer" },
    { id: 2, value: "Cider" },
    { id: 3, value: "White wine" },
    { id: 4, value: "Red wine" },
    { id: 5, value: "Alcohol free" },
  ];

  return (
    <SafeAreaView style={GlobalStyles.container}>

      <View style={GlobalStyles.topOfPage} />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("StudentLoginPage")}
        >
          <Image style={GlobalStyles.backArrow} source={backArrow} />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={GlobalStyles.header}> Create Profile </Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={styles.contentContainer}>
          <View style={styles.profilePic}>
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                backgroundColor: "white",
                justifyContent: "center",
                alignSelf: "center",
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputComponent}>
              <Text style={styles.inputHeader}>First name</Text>
              <TextInput
                placeholder="First name..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              ></TextInput>
            </View>
            <View style={styles.inputComponent}>
              <Text style={styles.inputHeader}>Last name</Text>
              <TextInput
                placeholder="Last name..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              ></TextInput>
            </View>
            <View style={styles.inputComponent}>
              <Text style={styles.inputHeader}>Email</Text>
              <TextInput
                placeholder="Email..."
                placeholderStyle={styles.placeholderStyle}
                style={GlobalStyles.inputText}
                value={email}
                onChangeText={(text) => setEmail(text)}
              ></TextInput>
            </View>
            <View style={styles.inputComponent}>
              <Text style={styles.inputHeader}>Password</Text>
              <TextInput
                placeholder="Password..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
                value={password}
                onChangeText={(text) => setPassword(text)}
              ></TextInput>
            </View>
            <View style={styles.inputComponent}>
              <Text style={styles.inputHeader}>Re enter password</Text>
              <TextInput
                placeholder="Re enter password..."
                placeholderTextColor={"grey"}
                style={GlobalStyles.inputText}
              ></TextInput>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                GlobalStyles.button,
                pressed && { opacity: 0.8 },
              ]}
              onPress={toggleNextStepModal}
            >
              <Text style={GlobalStyles.buttonText}>Next step</Text>
            </Pressable>
          </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={nextStepModalVisible}
        onClose={toggleNextStepModal}
      >
        <View style={GlobalStyles.modalContainer}>
          
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={toggleNextStepModal}>
              <Image style={GlobalStyles.backArrow} source={backArrow} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <Text style={GlobalStyles.header}> Create Profile </Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputComponent}>
              <Text style={styles.inputHeader}>City </Text>
              <TextInput
                placeholder="City"
                placeholderStyle={styles.placeholderStyle}
                style={GlobalStyles.inputText}
              ></TextInput>
            </View>

            <View style={styles.inputComponent}>
              <Text style={styles.inputHeader}> Food preferences </Text>
              <TextInput
                placeholder="Food preferences"
                placeholderStyle={styles.placeholderStyle}
                style={GlobalStyles.inputText}
              ></TextInput>
            </View>

            <View style={styles.inputComponent}>
              <Text style={styles.inputHeader}>Drink preferences</Text>
              <MultipleSelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                search={false}
                label="Choosen drink preferences"
                labelStyles={{ fontWeight: "regular" }}
                badgeStyles={{ backgroundColor: "#6B48D3", color: "white" }}
                placeholder="Choose drink preferences"
                style
                rowBack
                boxStyles={{
                  backgroundColor: "white",
                  borderColor: "white",
                  borderRadius: 4,
                }}
                dropdownStyles={{
                  backgroundColor: "white",
                  borderColor: "white",
                  borderRadius: 4,
                }}
                checkBoxStyles={{ color: "grey" }}
              />
            </View>

          </View>
        <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                GlobalStyles.button,
                pressed && { opacity: 0.8 },
              ]}
              onPress={toggleNextStepModal}
            >
              <Text style={GlobalStyles.buttonText}>Complete profile</Text>
            </Pressable>
          </View>
          </View>
      </Modal>
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
    marginBottom: 20,
    width: "auto",
    flex: 2,
  },
  contentContainer: {
    marginTop: "1%",
    
    flex: 1,
  },
  inputComponent: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 40,
  },
  inputModalContainer: {
    width: "100%",
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  inputHeader: {
    marginVertical: "1%",
    fontWeight: 400,
  },
});
