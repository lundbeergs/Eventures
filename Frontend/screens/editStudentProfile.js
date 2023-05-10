import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import GlobalStyles from "../global-style";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../axios";
import userInfo from "../userData";
import { useNavigation } from '@react-navigation/native';

export default function EditStudentProfileScreen() {
  const [first_name, setFirstName] = useState(userInfo.userinfo_first_name);
  const [last_name, setLastName] = useState(userInfo.userinfo_last_name);
  const [phone_number, setPhoneNumber] = useState(
    userInfo.userinfo_phone_number
  );
  const token = userInfo.userinfo_token;
  const [allergies, setAllergies] = useState(userInfo.userinfo_allergies);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const navigation = useNavigation();

  const handleSave = async () => {
    const body = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      allergies: allergies,
    };
    try {
      const response = await API_BASE_URL.put(`/api/profile/`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      userInfo.userinfo_first_name = first_name;
      userInfo.userinfo_last_name = last_name;
      userInfo.userinfo_phone_number = phone_number;
      userInfo.userinfo_allergies = allergies;
      setEditing(false);
      navigation.navigate('MyProfilePage', { refresh: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View>
        <View style={styles.inputContainer}>
          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}> First name</Text>
            <TextInput
              placeholder={"First name..."}
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              value={first_name}
              onChangeText={(text) => setFirstName(text)}
            ></TextInput>
          </View>
          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}>Last name</Text>
            <TextInput
              placeholder={"Last name..."}
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              value={last_name}
              onChangeText={(text) => setLastName(text)}
            ></TextInput>
          </View>
          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}>Phone number</Text>
            <TextInput
              placeholder={"Phone number..."}
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              value={phone_number}
              onChangeText={(text) => setPhoneNumber(text)}
            ></TextInput>
          </View>
          <View style={styles.inputComponent}>
            <Text style={styles.inputHeader}>Allergies</Text>
            <TextInput
              placeholder={"Allergies..."}
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              value={allergies}
              onChangeText={(text) => setAllergies(text)}
            ></TextInput>
          </View>
          <View style={{ marginHorizontal: 40, marginTop: 20 }}>
            <TouchableOpacity style={styles.editButton} onPress={handleSave}>
              <Text style={styles.buttonText}> SAVE </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 10,
  },
  myMembershipsText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: 600,
    justifyContent: "center",
    alignSelf: "center",
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: "100%",
    height: 45,
    backgroundColor: "#6B48D3",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
