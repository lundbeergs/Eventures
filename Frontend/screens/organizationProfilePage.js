import React from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import stsKV from "../assets/images/stsKV.jpg";
import whiteCirkle from "../assets/images/whiteCirkle.png";
import PurpleButton from "../components/PurpleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import { useNavigation } from "@react-navigation/native";

const orgInfo = {
  orginfo_name: "STS-sektionen",
  orginfo_information: "Välkommen till STS-sektionen",
};

//<Image style={styles.orgIcon} source={route.params.orgIcon} />

const OrganizationProfilePage = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const requestHandler = async () => {
      navigation.navigate("Requests");
  };

  const memberHandler = async () => {
    navigation.navigate("Members");
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
    <View style={{ backgroundColor: "#BDE3FF", flex: 1 }}>
      <ScrollView>
        <View style={styles.informationContainer}>
          <Image style={styles.orgProfilePic} source={stsKV} />
          <Image style={styles.orgIconBackground} source={whiteCirkle} />
          <Text
            style={{
              marginTop: "55%",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {orgInfo.orginfo_name}
          </Text>
          <Text style={{ marginTop: "5%", marginLeft: "5%" }}>
            {orgInfo.orginfo_information}
          </Text>
          <View style={{ marginHorizontal: 10 }}>
            <PurpleButton
              onPress={requestHandler}
              text={"Membership requests"}
            />
            <PurpleButton
              onPress={memberHandler}
              text={"Members"}
            />
          </View>
        </View>

        <View style={styles.orgEventures}>
          <Text style={{ textAlign: "center", fontSize: 17 }}>
            {" "}
            {orgInfo.orginfo_name}s eventures{" "}
          </Text>
        </View>
      </ScrollView>
      <View style={{ marginHorizontal: 20 }}>
        <PurpleButton onPress={logOutHandler} text={"Log Out"}></PurpleButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  informationContainer: {
    height: 'auto',
    marginRight: "3%",
    marginLeft: "3%",
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 5,
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
  orgProfilePic: {
    height: 190,
    width: 340,
    marginTop: "3%",
    marginLeft: "3%",
    marginRight: "1.5%",
    zIndex: 1,
    position: "absolute",
  },

  orgIconBackground: {
    height: 100,
    width: 100,
    zIndex: 2,
    position: "absolute",
    top: "43%",
    left: "1.8%",
  },

  orgIcon: {
    height: 45,
    width: 45,
    borderRadius: 30,
    zIndex: 3,
    position: "absolute",
    top: "51.2%",
    left: "10%",
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
});

export default OrganizationProfilePage;
