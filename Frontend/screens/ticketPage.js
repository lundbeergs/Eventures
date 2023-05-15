import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { API_BASE_URL } from "../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../global-style";

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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
      <View style={styles.ticketContainer}>
        <Text style={styles.eventTitle}>{event?.event_name}</Text>
        <QRCode
          value={item.ticket_code}
          size={200}
          color="black"
          backgroundColor="white"
          style={styles.qrCode}
        />
      </View>
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEventData();
    fetchTickets();
    setRefreshing(false);
  };

  return (
    <View style={GlobalStyles.container}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTicket}
        contentContainerStyle={styles.flatListContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} progressBackgroundColor={'white'} progressViewOffset={-20}/>
  }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    alignItems: "center",
    width: '100%',
  },
  ticketContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: 'white',
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
});

export default TicketPage;

