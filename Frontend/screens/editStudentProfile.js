import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import GlobalStyles from "../global-style";
import { useState, useEffect} from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";

export default function EditStudentProfileScreen() {
  const navigation = useNavigation();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [allergies, setAllergies] = useState("");

  const handleSave = async () => {
    const body = {
      first_name: first_name,
      last_name: last_name,
      allergies: allergies,
    };
    
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(body)
      const response = await API_BASE_URL.put(`/api/profile/`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('hej'+body)
      console.log(response.data);
      navigation.navigate('MyProfilePage', { isProfileUpdated: true });
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: userProfile } = response.data;
      if (userProfile && userProfile.length > 0) {
        const { first_name, last_name, allergies } = userProfile[0];
        setFirstName(first_name);
        setLastName(last_name);
        setAllergies(allergies);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

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
