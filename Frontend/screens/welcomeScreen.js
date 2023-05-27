import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { API_BASE_URL } from "../axios.js";

import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";

import GlobalStyles from "../global-style";
import eventures from "../assets/images/eventures.png";
import PurpleButton from "../components/PurpleButton";
import { StatusBar } from "expo-status-bar";
import Loader from "../components/Loader";

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  const checkRefreshTokenFromStorage = async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      const storedAccessToken = await AsyncStorage.getItem("accessToken");
      console.log("Refresh: " + storedRefreshToken);
      console.log("Access: " + storedAccessToken);

      if (storedRefreshToken) {
        const decodedRefreshToken = jwtDecode(storedRefreshToken);
        if (decodedRefreshToken.exp * 1000 > Date.now()) {
          console.log("Refreshtoken fine!!!");

          const decodedAccessToken = jwtDecode(storedAccessToken);
          if (decodedAccessToken.exp * 1000 > Date.now()) {
            console.log("Accesstoken fine!!!");
            await checkUserType(storedAccessToken);
          } else {
            console.log("Refresh tokens!");
            await refreshTokens();
            checkRefreshTokenFromStorage();
          }
        } else {
          console.log("No refreshtoken found, lets go to first page!");
          navigation.navigate("FirstPage");
        }
      } else {
        console.log("No tokens found, lets go to first page!");
        navigation.navigate("FirstPage");
      }
    } catch (error) {
      console.log("Error retrieving token from storage:", error);
    }
  };

  const checkUserType = async (storedAccessToken) => {
    const storedUserType = await AsyncStorage.getItem("userType");
    if (storedUserType == "is_student") {
        console.log("EN STUDENT");
        getProfile(storedAccessToken);
        navigation.navigate("HomeStackStudent");
      } else if (storedUserType == "is_organization") {
        console.log("EN ORGANIZATION");
        navigation.navigate("HomePageOrganization");
      }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      checkRefreshTokenFromStorage();
    }, 4000); // Wait for 8 seconds before setting isLoading to false
  }, []);

  const refreshTokens = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      console.log("Refresh token från funktion " + refreshToken);
      if (!refreshToken) {
        throw new Error("Refresh token not found in storage");
      }
      const response = await API_BASE_URL.post("/api/refresh/", {
        refresh: refreshToken,
      });
      console.log(response.data);
      const { access, refresh: newRefreshToken } = response.data;
      console.log("New access: " + access);
      console.log("New refresh: " + newRefreshToken);
      if (!access || !newRefreshToken) {
        throw new Error("Tokens not found in response data");
      }
      storeAccessTokenInStorage(access);
      await AsyncStorage.setItem("refreshToken", newRefreshToken);
    } catch (error) {
      console.log("Error refreshing tokens:", error);
      removeTokenFromStorage();
    }
  };

  const storeAccessTokenInStorage = async (token) => {
    try {
      console.log("Access: " + token);
      await AsyncStorage.setItem("accessToken", token);
    } catch (error) {
      console.log("Error storing accesstoken in storage:", error);
    }
  };

  const removeTokenFromStorage = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
    } catch (error) {
      console.log("Error removing token from storage:", error);
    }
  };

  const getProfile = async (accessToken) => {
    try {
      const response = await API_BASE_URL.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: userProfile } = response.data;

      if (userProfile && userProfile.length > 0) {
        const { first_name, last_name, allergies, id } = userProfile[0];
        await AsyncStorage.setItem("firstName", first_name);
        await AsyncStorage.setItem("lastName", last_name);
        await AsyncStorage.setItem("allergies", allergies);
        await AsyncStorage.setItem("studentId", id);
        console.log("Data saved in AsyncStorage.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />
      {isLoading ? ( // render the loader if isLoading is true
        <Loader />
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: "8%",
  },
  itemContainer: {
    width: "63.5%",
  },
});
