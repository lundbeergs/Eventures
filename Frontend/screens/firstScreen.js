import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";

import GlobalStyles from "../global-style";
import eventures from "../assets/images/eventures.png";
import PurpleButton from "../components/PurpleButton";
import { StatusBar } from "expo-status-bar";

export default function FirstPage() {
  const navigation = useNavigation();

  const checkRefreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        const decodedToken = jwtDecode(refreshToken);
        const isExpired = decodedToken.exp * 1000 < Date.now();
        if (!isExpired) {
          navigation.navigate("HomeStackStudent", { userData: decodedToken });
        } else {
          // Handle expired refresh token
          console.log("Refresh token is expired");
          studentButtonHandler();
        }
      }
    } catch (error) {
      console.log("Error retrieving refresh token:", error);
      // Handle the error
    }
  };

  useEffect(() => {
    checkRefreshToken();
  }, []);

  function studentButtonHandler() {
    navigation.navigate("StudentLoginPage");
  }

  function organizationButtonHandler() {
    navigation.navigate("OrganizationLoginPage");
  }


  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content"/>
      <Image style={GlobalStyles.eventuresImage} source={eventures}></Image>
      <View style={styles.contentContainer}>
        <Text style={GlobalStyles.header}> I am a... </Text>
        <View style={GlobalStyles.buttonContainer}>
          <PurpleButton onPress={studentButtonHandler} text={"Student"} />
          <PurpleButton
            onPress={organizationButtonHandler}
            text={"Organization"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 40,
  },
  itemContainer: {
    width: "63.5%",
  },
});
