import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState} from "react";
import GlobalStyles from "../global-style";
import userInfo from "../userData";

const MyProfilePage = () => {
  const navigation = useNavigation();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [allergies, setAllergies] = useState("");

  const handleEditProfile = () => {
    navigation.navigate('EditStudentProfilePage');
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View>
        <View style={styles.inputContainer}>
          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}> First name </Text>
            <Text style={GlobalStyles.inputText}>
              {userInfo.userinfo_first_name}
            </Text>
          </View>

          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}>Last name</Text>
            <Text style={GlobalStyles.inputText}>
              {userInfo.userinfo_last_name}
            </Text>
          </View>

          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}>Phone number</Text>
            <Text style={GlobalStyles.inputText}>
              {userInfo.userinfo_phone_number}
            </Text>
          </View>

          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}>Allergies</Text>
            <Text style={GlobalStyles.inputText}>
              {userInfo.userinfo_allergies}
            </Text>
          </View>

          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}>Drink preferences</Text>
            <Text style={GlobalStyles.inputText}>Drink Preferences</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 40, marginTop: 20 }}>
          <View style={styles.myMembershipsField}>
            <Text style={styles.myMembershipsText}>My memberships</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}> 
            <Text style={styles.buttonText}> Edit Profile </Text>
            <Ionicons name="create-outline" size={30} color="white" alignSelf='center'/>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "auto",
  },
  profileTextContainer: {
    flex: 1,
  },
  profilePic: {
    justifyContent: "center",
  },
  textField: {
    justifyContent: "center",
    alignSelf: "center",
  },
  editIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  inputHeader: {
    marginVertical: "1%",
    fontWeight: 400,
  },
  inputComponent: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 40,
  },
  myMembershipsField: {
    padding: 8,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 10,
  },
  myMembershipsText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 1)',
    fontWeight: 600,
    justifyContent: "center",
    alignSelf: 'center'
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    width: '100%',
    height: 45,
    backgroundColor: "#6B48D3",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },

});

export default MyProfilePage;
