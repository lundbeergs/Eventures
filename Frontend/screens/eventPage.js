import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import PurpleButton from "../components/PurpleButton";
import QRCode from "react-native-qrcode-svg";
import GlobalStyles from "../global-style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import PopUpModal from "../components/PopUpModal";


const EventPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(185); // Initial max height of eventInformation
  const [showModal, setShowModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState("");
  const [popUpModalVisible, setPopUpModalVisible] = useState(false);
  const eventPic = route.params.eventPic

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
    fetchEventID();
  }, [eventId]);

  const togglePopUpModal = () => {
    setPopUpModalVisible(!popUpModalVisible);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Update the max height based on the expanded state
    setMaxHeight(isExpanded ? 185 : 9999);
  };

  const fetchEventID = () => {
    setEventId(route.params.eventId);
    console.log(eventId);
  }

  const checkIfHasTicket = async (eventId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/student-tickets/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const userTickets = response.data;
      const hasTicket = userTickets.some((ticket) => ticket.event_id === eventId);
  
      return hasTicket;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const buyTicketHandler = async () => {
    const body = { event_id: eventId };
    try {
      if (checkIfHasTicket(eventId)) {
        setError("You already have a ticket for this event. Find it in 'My Tickets.");
        togglePopUpModal();
        // You can show an alert or display a message to the user indicating that they already have a ticket.
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
        console.log("hej" + body);
        console.log(buyResponse.data);
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
  

  return (
    <View style={GlobalStyles.container}>
      <ScrollView
        style={{ flexGrow: 1, backgroundColor: "#BDE3FF" }}
      >
        <View style={styles.container}>
          <View
            style={styles.informationContainer}
          >
            <Image
              style={styles.eventPic}
              source={eventPicSource}
            />
            <Text
              style={{
                marginTop: "55%",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              {route.params.eventTitle}
            </Text>

            <Text style={[styles.eventInformation, { maxHeight: maxHeight }]}>
              {route.params.eventInformation}
            </Text>

            <Text style={styles.readMore} onPress={toggleExpand}>
              {isExpanded ? "Read less..." : "Read more..."}
            </Text>
          </View>

          <View style={styles.video}>
            <Text style={{ textAlign: "center", fontSize: 17 }}>
              {route.params.organization}s släppfilm här
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={{marginHorizontal: 20}}>
      <PurpleButton onPress={buyTicketHandler} text={"Buy Ticket"}
  />
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
          <Text style={styles.modalTitle}>You got a ticket to {route.params.eventTitle}!</Text>
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={route.params.eventTitle}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </View>
            <View>
            <PurpleButton onPress={closeModalHandler} text={'Close'}/>
            </View>
          </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: '8%'
  },
  informationContainer: {
    flex: 1,
    width: '100%', // Set the width to 100%
    minHeight: 470,
    maxHeight: 9999,
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
  },
  greenFrame: {
    backgroundColor: 'rgba(144, 238, 144, 0.5)',
    margin: 10,
    borderRadius: 20,
    overflow: "hidden", // clip the corners of inner view
  },
  eventPic: {
    height: 190,
    width: 340,
    marginTop: '3%',
    marginLeft: '3%',
    marginRight: '1.5%',
    zIndex: 1,
    position: 'absolute'
  },
  
  eventInformation: {
    marginTop: '5%', 
    marginLeft: '5%',
    marginBottom: 10
  },
  video: {
    height: 150,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 15,
    marginLeft: 15,
    margin: '3%',
    borderRadius: 5
  },
 
  readMore: {
    textAlign: 'center',
    color: 'blue',
    marginBottom: 10
  },
  modalContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10, // add top margin to the header
    textAlign: "center",
    
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#6B48D3',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default EventPage;
