import {
  View,
  FlatList,
  RefreshControl,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import EventList from "../components/event-list";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../axios.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PurpleButton from "../components/PurpleButton";
import { useNavigation } from "@react-navigation/native";

const HomePageStudent = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [data, setData] = useState({
    eventData: [],
    orgData: [],
    membershipData: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const [eventResponse, orgResponse, membershipResponse] =
        await Promise.all([
          API_BASE_URL.get(`/api/events/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          API_BASE_URL.get("/api/organizations/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          API_BASE_URL.get("/api/memberships/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

      const filteredEvents = eventResponse.data.filter((event) =>
        membershipResponse.data.some(
          (member) => member.organization === event.event_org
        )
      );

      const membershipIds = membershipResponse.data.map((item) => ({
        organization: item.organization,
      }));

      setData({
        eventData: filteredEvents.reverse(),
        orgData: orgResponse.data,
        membershipData: membershipIds,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={{ backgroundColor: "#BDE3FF", flex: 1 }}>
      {data.eventData.length === 0 && (
        <View style={styles.messageContainer}>
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              You are not a member of any organization. {"\n\n"}
              Start exploring by searching for events and organizations!
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Search")}}>
              <Text style={styles.buttonText}>Search </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <FlatList
        data={data.eventData}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <EventList eventData={data.eventData} orgData={data.orgData} />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressBackgroundColor={"white"}
            progressViewOffset={-20}
          />
        }
      />
    </View>
  );
};

export default HomePageStudent;

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBox: {
    margin: "10%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#6B48D3",
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});

/*const [eventData, setEventData] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);*/

/*useEffect(() => {
    fetchMemershipData();
    fetchOrgData();
    fetchEventData();
  }, [] )

  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get(`/api/events/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const filteredEvents = response.data.filter(event =>
        membershipData.some(member => member.organization === event.event_org),
      );
      setEventData(filteredEvents);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrgData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await API_BASE_URL.get('/api/organizations/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOrgData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMemershipData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await API_BASE_URL.get('/api/memberships/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const membershipData = response.data.map((item) => ({
        organization: item.organization,
      }));
      setMembershipData(membershipData);
    } catch (error) {
      console.error(error);
    }
  };


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEventData();
    setRefreshing(false);
  };*/
