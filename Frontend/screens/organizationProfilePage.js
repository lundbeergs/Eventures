import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from "react-native";
import PurpleButton from "../components/PurpleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../global-style";
import OnlyEventOrg from "../components/only-events-org";

const OrganizationProfilePage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [orgName, setOrgName] = useState("");
  const [orgBio, setOrgBio] = useState("");
  const [eventData, setEventData] = useState([]);
  const [orgId, setOrgId] = useState("");

  const requestHandler = async () => {
    navigation.navigate("Requests");
  };

  const memberHandler = async () => {
    navigation.navigate("Members");
  };

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
        console.log(id);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (orgId) {
      fetchEventData();
    }
  }, [orgId]);

  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/events/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      const allEvents = response.data;
      const filteredEvents = allEvents.filter(
        (eventData) => eventData.event_org === orgId
      );
      setEventData(filteredEvents);
      console.log(filteredEvents);
    } catch (error) {
      console.error(error);
    }
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

    console.log("VIKTIGT");

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
        price={event_price + " kr"}
        releaseDate={release_date}
        releaseTime={release_time}
        ticketsLeft={tickets_left}
      />
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView>
        <View style={styles.whiteBox}>
          <ImageBackground
            source={require("../assets/images/eventures_background.png")}
            style={styles.imageBackground}
          >
            <View style={styles.initialsContainer}>
              <View style={styles.initialsBackground}>
                <Text style={styles.initials}>{orgName}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.infotextContainer}>
            <Text style={styles.header}>{orgName}</Text>
            <Text style={styles.text}>{orgBio}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <PurpleButton onPress={requestHandler} text={"Membership requests"} />
          <PurpleButton onPress={memberHandler} text={"Memberships"} />
        </View>
        </ScrollView>

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ marginHorizontal: "8%" }}>
            <View style={styles.myEventuresField}>
              <Text style={styles.myEventuresText}>My eventures</Text>
            </View>
          </View>
          <View style={styles.eventField}>
            <FlatList
              data={eventData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderEventItem}
              contentContainerStyle={styles.eventListContainer}
              
            />
            {/* {eventData.map((event) => (
            <View key={event.id}>
              <Text>{event.event_name}</Text>
            </View>
          ))} */}
          </View>
        </View>
      <View style={{ alignItems: "center" }}>
        <View style={styles.buttonContainer}>
          <PurpleButton onPress={logOutHandler} text="Log Out" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  whiteBox: {
    height: "35%",
    backgroundColor: "white",
    borderRadius: 4,
    marginHorizontal: "8%",
    padding: "2%",
  },
  lowerWhiteBoxContainer: {
    flex: 1,
    flexDirection: "row",
  },
  imageBackground: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    // backgroundColor: "rgba(255, 255, 255, 0.4)",
    // borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 40,
    color: "white",
    fontWeight: "800",
  },
  infotextContainer: {
    marginVertical: "2%",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "normal",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: "8%",
    marginBottom: 10,
  },
  myEventuresField: {
    paddingVertical: "2%",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 10,
  },
  myEventuresText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "600",
    justifyContent: "center",
    alignSelf: "center",
  },
  eventField: {
    width: "100%",
    borderRadius: 4,
    marginVertical: "2%",
    paddingHorizontal: "4.5%",
    marginBottom: "30%",
  },
});

export default OrganizationProfilePage;

