import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import GlobalStyles from "../global-style";
import { useState, useEffect} from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import PurpleButton from "../components/PurpleButton";
import PopUpModal from "../components/PopUpModal";

export default function EditStudentProfileScreen() {
  const navigation = useNavigation();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = async () => {
    if (!first_name || !last_name || !allergies) {
      setError("Please fill in all the required fields to edit your profile");
      setModalVisible(true);
      return;
    }
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

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
        <View style={GlobalStyles.inputContainer}>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}> First name</Text>
            <TextInput
              placeholder={"First name..."}
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              value={first_name}
              onChangeText={(text) => setFirstName(text)}
            ></TextInput>
          </View>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>Last name</Text>
            <TextInput
              placeholder={"Last name..."}
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              value={last_name}
              onChangeText={(text) => setLastName(text)}
            ></TextInput>
          </View>
          <View style={GlobalStyles.inputComponent}>
            <Text style={styles.inputHeader}>Allergies</Text>
            <TextInput
              placeholder={"Allergies..."}
              placeholderTextColor={"grey"}
              style={GlobalStyles.inputText}
              value={allergies}
              onChangeText={(text) => setAllergies(text)}
            ></TextInput>
          </View>
          <View style={styles.buttonContainer}> 
          <PurpleButton onPress={handleSave} text={'Save'}/>
          </View>
        </View>
        <PopUpModal
        isVisible={modalVisible}
        text={error}
        closeModal={closeModal}
        buttonText="OK"
      />
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
  buttonContainer: {
    width: "100%",
    paddingHorizontal: '8%',
  },
});
