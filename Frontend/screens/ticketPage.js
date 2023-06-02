import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { API_BASE_URL } from "../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../global-style";
import PurpleButton from "../components/PurpleButton";

// This page generates the users ticket as QR codes, using react native inbuild qr-code generator

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState("");

  useEffect(() => {
    fetchEventData();
    fetchTickets();
  }, []);

  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get(`/api/events/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTickets = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/student-tickets/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEventById = (eventId) => {
    return events.find((event) => event.id === eventId);
  };

  const renderTicket = ({ item }) => {
    const event = getEventById(item.event);
    return (
      <TouchableOpacity
        style={styles.ticketContainer}
        onPress={() => {
          setSelectedTicket(event.event_name);
          toggleTicketModal();
        }}
      >
        <Text style={styles.eventTitle}>{event?.event_name}</Text>
        <QRCode
          value={item.ticket_code}
          size={200}
          color="black"
          backgroundColor="white"
          style={styles.qrCode}
        />
      </TouchableOpacity>
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEventData();
    fetchTickets();
    setRefreshing(false);
  };

  const toggleTicketModal = () => {
    console.log(selectedTicket);
    setTicketModalVisible(!ticketModalVisible);
  };

  return (
    <View style={GlobalStyles.container}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTicket}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressBackgroundColor={"white"}
            progressViewOffset={-20}
          />
        }
      />
      <Modal
        visible={ticketModalVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
      >
        <View style={styles.outerModalContainer}>
          <View style={styles.ticketFrame}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedTicket}</Text>
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={selectedTicket}
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
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    alignItems: "center",
    width: "100%",
  },
  ticketContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  qrCode: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: "8%",
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
  ticketFrame: {
    backgroundColor: "rgba(184, 227, 255, 0.5)",
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  eventPic: {
    height: 190,
    width: 340,
    marginTop: "3%",
    marginLeft: "3%",
    marginRight: "1.5%",
    zIndex: 1,
    position: "absolute",
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

  eventInformation: {
    marginTop: "5%",
    marginLeft: "5%",
    marginBottom: 10,
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

export default TicketPage;
