import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  RefreshControl,
} from "react-native";
import PurpleButton from "../components/PurpleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../global-style";

const OrganizationProfilePage = () => {
  const navigation = useNavigation();
  const [orgName, setOrgName] = useState("");
  const [orgBio, setOrgBio] = useState("");
  const [orgId, setOrgId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Function navigating the user to the request page
  const requestHandler = async () => {
    navigation.navigate("Requests");
  };

  // Function navigating the user to the member page
  const memberHandler = async () => {
    navigation.navigate("Members");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getProfile();
    setRefreshing(false);
  };

  // Getting the organization profile from the database
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
        setOrgId(id);
        console.log(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const logOutHandler = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      // Blacklisting all the tokens
      const response = await API_BASE_URL.post(
        "/api/logout/",
        {
          all: true,
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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressBackgroundColor="white"
            progressViewOffset={-20}
          />
        }
      >
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
          <PurpleButton onPress={requestHandler} text={"Membership Requests"} />
          <PurpleButton onPress={memberHandler} text={"Members"} />
        </View>

        <View style={{ alignItems: "center", bottom: "2%" }}>
          <View style={styles.buttonContainer}>
            <PurpleButton onPress={logOutHandler} text="Sign Out" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  whiteBox: {
    height: "70%",
    backgroundColor: "white",
    borderRadius: 4,
    marginHorizontal: "4%",
    padding: "2%",
    flex: 1,
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
    width: "100%",
    height: "100%",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 40,
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
    paddingHorizontal: "4%",
    marginBottom: 10,
  },
});

export default OrganizationProfilePage;
