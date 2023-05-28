import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  FlatList,
  RefreshControl,
} from "react-native";
import PurpleButton from "../components/PurpleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../global-style";
import OnlyEventOrg from "../components/only-events-org";

const MyEventuresOrgPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [orgName, setOrgName] = useState("");
  const [orgBio, setOrgBio] = useState("");
  const [eventData, setEventData] = useState([]);
  const [orgId, setOrgId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const getProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: userProfile } = response.data;

      if (userProfile && userProfile.length > 0) {
        const { org_name, org_bio, id } = userProfile[0];
        setOrgName(org_name);
        setOrgBio(org_bio);
        setOrgId(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
    fetchEventData();
  }, [orgId]);

  const handleRefresh = () => {
    setRefreshing(true);
    getProfile();
    fetchEventData();
    setRefreshing(false);
  };

  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/events/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const allEvents = response.data;
      const filteredEvents = allEvents.filter(
        (eventData) => eventData.event_org === orgId
      );
      setEventData(filteredEvents);
    } catch (error) {
      console.error(error);
    }
  };

  const renderEventItem = ({ item }) => {
    const org_name = orgName;
    const org_id = id;

    const {
      orgId,
      orgName,
      organizationInformation,
      event_org,
      orgIcon,
      orgProfilePic,
      id,
      event_name,
      event_pic,
      event_desc,
      event_location,
      event_date,
      event_time,
      event_price,
      release_date,
      release_time,
      tickets_left,
    } = item;

    return (
      <OnlyEventOrg
        orgId={event_org}
        orgIcon={orgIcon}
        orgProfilePic={orgProfilePic}
        organizationInformation={organizationInformation}
        eventId={id}
        eventTitle={event_name}
        eventPic={event_pic}
        eventInformation={event_desc}
        location={event_location}
        date={event_date}
        time={event_time}
        price={event_price}
        releaseDate={release_date}
        releaseTime={release_time}
        ticketsLeft={tickets_left}
      />
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.eventField}>
          <FlatList
            data={eventData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
            contentContainerStyle={styles.eventListContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                progressBackgroundColor="white"
                progressViewOffset={-20}
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  eventField: {
    width: "100%",
    borderRadius: 4,
    marginVertical: "2%",
    flex: 1,
  },
});

export default MyEventuresOrgPage;
