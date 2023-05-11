import React, { useState, useEffect } from "react";
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
import Loader from "../components/Loader";

export default function FirstPage() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 4000); // Wait for 8 seconds before setting isLoading to false
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
      <StatusBar barStyle="dark-content" />
      {isLoading ? ( // render the loader if isLoading is true
        <Loader />
      ) : (
        // otherwise, render the content
        <>
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
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: '8%',
  },
  itemContainer: {
    width: "63.5%",
  },
});
