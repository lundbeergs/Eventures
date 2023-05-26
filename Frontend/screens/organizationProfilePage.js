import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import PurpleButton from "../components/PurpleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../global-style";

const OrganizationProfilePage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [orgName, setOrgName] = useState("");
  const [orgBio, setOrgBio] = useState("");
  const [eventData, setEventData] = useState([]);
  const [Id, setId] = useState("");

  const requestHandler = async () => {
      navigation.navigate("Requests");
  };

  const memberHandler = async () => {
    navigation.navigate("Members");
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
        const { org_name, org_bio, id } = userProfile[0];
        setOrgName(org_name);
        setOrgBio(org_bio);
        setId(id);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProfile();
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/events/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setEventData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const logOutHandler = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");

      const response = await API_BASE_URL.post(
        "/api/logout/",
        {
          all: true, // Set the 'all' key to true to blacklist all refresh tokens
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");

        navigation.navigate("FirstPage");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={styles.whiteBox}>
        <ImageBackground
          source={require("../assets/images/eventures_background.png")}
          style={styles.imageBackground}
        >
          <View style={styles.initialsContainer}>
            <View style={styles.initialsBackground}>
              <Text style={styles.initials}>{orgName}</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.infotextContainer}>
          <Text style={styles.header}>{orgName}</Text>
          <Text style={styles.text}>{orgBio}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <PurpleButton
          onPress={requestHandler}
          text={"Membership requests"}
        />
        <PurpleButton onPress={memberHandler} text={"Memberships"} />
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ marginHorizontal: "8%" }}>
          <View style={styles.myEventuresField}>
            <Text style={styles.myEventuresText}>My eventures</Text>
          </View>
          {eventData.map((event) => (
            <View key={event.id}>
              <Text>{event.event_name}</Text>
            </View>
          ))}
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={styles.buttonContainer}>
            <PurpleButton onPress={logOutHandler} text="Log Out" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  whiteBox: {
    height: "48%",
    backgroundColor: "white",
    borderRadius: 4,
    marginHorizontal: "8%",
    padding: "2%",
  },
  lowerWhiteBoxContainer: {
    flex: 1,
    flexDirection: "row",
  },
  imageBackground: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsContainer: {
    position: "relative",
    width: 180,
    height: 60,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 20,
    color: "white",
    fontWeight: "800",
  },
  infotextContainer: {
    marginVertical: "2%",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "normal",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: "8%",
    marginBottom: 10,
  },
  myEventuresField: {
    paddingVertical: "2%",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 10,
  },
  myEventuresText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "600",
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default OrganizationProfilePage;
