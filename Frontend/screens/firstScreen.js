import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";

import GlobalStyles from "../global-style";
import eventures from "../assets/images/eventures.png";
import PurpleButton from "../components/PurpleButton";
import { StatusBar } from "expo-status-bar";

export default function FirstPage() {
  const navigation = useNavigation();

  function studentButtonHandler() {
    navigation.navigate("StudentLoginPage");
  }

  function organizationButtonHandler() {
    navigation.navigate("OrganizationLoginPage");
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar barStyle="dark-content" />
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
    padding: "8%",
  },
  itemContainer: {
    width: "63.5%",
  },
});