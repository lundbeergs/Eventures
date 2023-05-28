import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import PurpleButton from "../components/PurpleButton";
import GlobalStyles from "../global-style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import PopUpModal from "../components/PopUpModal";

const OrgEventPage = () => {
  const route = useRoute();
  const [eventId, setEventId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const eventPic = route.params.eventPic;
  const eventTitle = route.params.eventTitle;
  const eventInformation = route.params.eventInformation;
  const location = route.params.location;
  const date = route.params.date;
  const time = route.params.time;
  const price = route.params.price;
  const releaseDate = route.params.releaseDate;
  const releaseTime = route.params.releaseTime;
  const ticketsLeft = route.params.ticketsLeft;

  const navigation = useNavigation();

  const imagePaths = {
    101: require("../assets/1.png"),
    102: require("../assets/2.png"),
    103: require("../assets/3.png"),
    104: require("../assets/4.png"),
    105: require("../assets/5.png"),
    106: require("../assets/6.png"),
    107: require("../assets/7.png"),
    108: require("../assets/8.png"),
  };

  const eventPicSource = imagePaths[eventPic];

  useEffect(() => {
    setEventId(route.params.eventId);
  })

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  function editEventHandler() {
    navigation.navigate("EditEventPage", {
        eventId: eventId,
        eventTitle: eventTitle,
        eventInformation: eventInformation,
        eventPic: eventPic,
        location: location,
        date: date,
        time: time,
        price: price,
        releaseDate: releaseDate,
        releaseTime: releaseTime,
        ticketsLeft: ticketsLeft,
      });
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView
        style={GlobalStyles.container}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9Bd35A", "#689F38"]}
            progressBackgroundColor="#fff"
          />
        }
      >
        <View style={styles.whiteBox}>
          <Image style={styles.eventPic} source={eventPicSource} />
          <View style={styles.lowerWhiteBoxContainer}>
            <View style={{ marginBottom: "3%" }}>
              <Text style={styles.header}>{eventTitle}</Text>
              <Text style={styles.text}>{eventInformation}</Text>
            </View>
            <View style={{ marginBottom: "3%" }}>
              <Text style={styles.text}>Location: {location}</Text>
              <Text style={styles.text}>Date: {date}</Text>
              <Text style={styles.text}>
                Time: {time.substring(0, 5)}
              </Text>
              <Text style={styles.text}>Price: {price}</Text>
            </View>
            <View style={{ marginBottom: "3%" }}>
              <Text style={styles.text}>
                {releaseDate
                  ? "Release date: " + releaseDate
                  : ""}
              </Text>
              <Text style={styles.text}>
                {releaseTime
                  ? "Release time: " + releaseTime.substring(0, 5)
                  : ""}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
            <View style={{marginHorizontal: '4%'}}>
            <PurpleButton onPress={editEventHandler} text={"Edit eventure"} />
            </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  whiteBox: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
    marginHorizontal: "4%",
    padding: "2%",
  },
  lowerWhiteBoxContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  header: {
    fontSize: 20,
    justifyContent: "center",
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: "2%",
  },
  text: {
    fontSize: 16,
    fontWeight: "regular",
  },

  informationContainer: {
    flex: 1,
    width: "100%",
    minHeight: 470,
    maxHeight: 9999,
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
  },
  greenFrame: {
    backgroundColor: "rgba(144, 238, 144, 0.5)",
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  pinkFrame: {
    backgroundColor: "rgba(255, 20, 147, 0.4)",
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  eventPic: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    width: "100%",
    height: 45,
    marginTop: 20,
    backgroundColor: "#6B48D3",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  ticketButton: {
    backgroundColor: "green",
  },
  disabledButton: {
    backgroundColor: "grey",
  },
  eventInformation: {
    marginTop: "5%",
    marginLeft: "5%",
    marginBottom: 10,
  },
  video: {
    height: 150,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginRight: 15,
    marginLeft: 15,
    margin: "3%",
    borderRadius: 5,
  },

  readMore: {
    textAlign: "center",
    color: "blue",
    marginBottom: 10,
  },
  modalContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
  },
  outerModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default OrgEventPage;
