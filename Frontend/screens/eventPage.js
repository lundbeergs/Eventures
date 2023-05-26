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
import { useRoute } from "@react-navigation/native";
import PurpleButton from "../components/PurpleButton";
import QRCode from "react-native-qrcode-svg";
import GlobalStyles from "../global-style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import PopUpModal from "../components/PopUpModal";

const EventPage = () => {
  const route = useRoute();
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(185); // Initial max height of eventInformation
  const [showModal, setShowModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState("");
  const [popUpModalVisible, setPopUpModalVisible] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const eventPic = route.params.eventPic;

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
    checkIfHasTicket();
  }, [eventId]);

  const checkIfHasTicket = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/student-tickets/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const eventIds = response.data.map((ticket) => ticket.event);
      const searchTickets = eventIds.includes(eventId);
      setHasTicket(searchTickets);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    checkIfHasTicket();
    setRefreshing(false);
  };

  const buyTicketHandler = async () => {
    checkIfHasTicket();
    const body = { event_id: eventId };
    try {
      if (hasTicket) {
        setError(
          "You already have a ticket for this event. Find it in 'My Tickets'."
        );
        console.log(error);
        togglePopUpModal();
      } else if (route.params.ticketsLeft == 0) {
        setError("There is no tickets left for this event!");
        console.log(error);
        togglePopUpModal();
      } else {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const buyResponse = await API_BASE_URL.post(
          `/api/events/${eventId}/buy/`,
          body,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setHasTicket(true);
        setShowModal(true);
      }
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const toggleTicketModal = () => {
    setTicketModalVisible(!ticketModalVisible);
  };

  const togglePopUpModal = () => {
    setPopUpModalVisible(!popUpModalVisible);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Update the max height based on the expanded state
    setMaxHeight(isExpanded ? 50 : 9999);
  };

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
              <Text style={styles.header}>{route.params.eventTitle}</Text>
              <Text style={styles.text}>{route.params.eventInformation}</Text>
            </View>
            <View style={{ marginBottom: "3%" }}>
              <Text style={styles.text}>Host: {route.params.orgName}</Text>
            </View>
            <View style={{ marginBottom: "3%" }}>
              <Text style={styles.text}>Location: {route.params.location}</Text>
              <Text style={styles.text}>Date: {route.params.date}</Text>
              <Text style={styles.text}>
                Time: {route.params.time.substring(0, 5)}
              </Text>
              <Text style={styles.text}>Price: {route.params.price}</Text>
            </View>
            <View style={{ marginBottom: "3%" }}>
              <Text style={styles.text}>
                {route.params.releaseDate
                  ? "Release date: " + route.params.releaseDate
                  : ""}
              </Text>
              <Text style={styles.text}>
                {route.params.releaseTime
                  ? "Release time: " + route.params.releaseTime.substring(0, 5)
                  : ""}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ marginHorizontal: 15 }}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 },
            hasTicket && styles.ticketButton,
            route.params.ticketsLeft === 0 && styles.disabledButton,
          ]}
          onPress={!hasTicket ? buyTicketHandler : toggleTicketModal}
          disabled={route.params.ticketsLeft === 0}
        >
          <Text style={styles.buttonText}>
            {hasTicket
              ? "Show Ticket"
              : route.params.ticketsLeft === 0
              ? "No Tickets Left"
              : "Buy Ticket"}
          </Text>
        </Pressable>
      </View>
      <PopUpModal
        isVisible={popUpModalVisible}
        text={error}
        buttonText={"OK"}
        closeModal={togglePopUpModal}
      />

      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
      >
        <View style={styles.outerModalContainer}>
          <View style={styles.greenFrame}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                You got a ticket to {route.params.eventTitle}!
              </Text>
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={route.params.eventTitle}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              </View>
              <View style={styles.modalButton}>
                <PurpleButton onPress={closeModalHandler} text={"Close"} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={ticketModalVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
      >
        <View style={styles.outerModalContainer}>
          <View style={styles.pinkFrame}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{route.params.eventTitle}</Text>
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={route.params.eventTitle}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              </View>
              <View style={styles.modalButton}>
                <PurpleButton onPress={toggleTicketModal} text={"Close"} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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

export default EventPage;
