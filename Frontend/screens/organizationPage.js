import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  RefreshControl,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import OnlyEventItem from "../components/only-events-item";
import EventuresBackground from "../assets/images/eventures_background.png";

const OrganizationPage = () => {
  const route = useRoute();
  const orgId = route.params.orgId;
  const [orgBio, setOrgBio] = useState("");
  const [isMember, setIsMember] = useState("");
  const [student, setStudent] = useState("");
  const [orgData, setOrgData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrgData();
    fetchEventData();
    checkMembership();
  }, [isMember]);

  const handleRefresh = () => {
    setRefreshing(true);
    checkMembership();
    setRefreshing(false);
  };

  const fetchOrgData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get(`/api/organizations/${orgId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const orgData = [
        {
          id: response.data.id,
          org_name: response.data.org_name,
        },
      ];
      setOrgBio(response.data.org_bio);
      setOrgData(orgData);
      console.log(orgData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get(`/api/events/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const filteredEvents = response.data.filter(
        (event) => event.event_org === orgId
      );

      setEventData(filteredEvents);
      console.log(eventData);
    } catch (error) {
      console.error(error);
    }
  };

  const checkMembership = async () => {
    try {
      setStudent(await AsyncStorage.getItem("studentId"));
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get(`/api/memberships/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const membershipData = response.data;
      const isOrganizationMember = membershipData.find(
        (membership) => membership.organization === orgId
      );

      if (isOrganizationMember) {
        setIsMember(true);
      } else {
        setIsMember(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const becomeMember = async () => {
    const body = {
      organization: orgId,
      student: student,
    };
    try {
      if (isMember == false) {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const response = await API_BASE_URL.post(
          `/api/membership/request/${orgId}/${student}/`,
          body,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Become member" + response.data);
      } else {
        console.log("Already a member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderEventItem = ({ item }) => {
    const org_name = orgData.orgname;
    const org_id = orgData.id;

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

    console.log(item);

    return (
      <OnlyEventItem
      orgId= {event_org}
      orgIcon={orgIcon} 
      orgProfilePic={orgProfilePic} 
      organizationInformation={organizationInformation} 
      eventId = {id}
      eventTitle={event_name}
      eventPic={event_pic}
      eventInformation={event_desc}
      location={event_location}
      date = {event_date}
      time={event_time}
      price={event_price + ' kr'}
      releaseDate = {release_date}
      releaseTime = {release_time}
      ticketsLeft={tickets_left}
      />
    );
  };

  return (
    <View style={{ backgroundColor: "#BDE3FF", flex: 1 }}>
      <View>
        <View style={styles.whiteBox}>
          <ImageBackground
            source={EventuresBackground}
            style={styles.imageBackground}
          >
            <View style={styles.initialsBackground}>
              <Text style={styles.initials}>{route.params.orgName}</Text>
            </View>
          </ImageBackground>
          <View style={styles.lowerWhiteBoxContainer}>
            <View style={styles.infotextContainer}>
              <Text style={styles.header}>{route.params.orgName}</Text>
              <Text style={styles.text}>{orgBio}</Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 },
              isMember && styles.memberButton,
            ]}
            onPress={!isMember ? becomeMember : undefined}
          >
            <Text style={styles.buttonText}>
              {isMember ? "Member" : "Become member"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.orgEventures}>
          <Text style={{ textAlign: "center", fontSize: 17 }}>
            {" "}
            {route.params.orgName}s eventures{" "}
          </Text>
        </View>
        <FlatList
          data={eventData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventItem}
          contentContainerStyle={styles.eventListContainer}
          // Add additional FlatList props as needed
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  whiteBox: {
    height: "35%",
    backgroundColor: "white",
    borderRadius: 4,
    marginHorizontal: "4%",
    padding: "2%",
  },
  lowerWhiteBoxContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageBackground: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsBackground: {
    paddingHorizontal: '4%',
    paddingVertical: '4%',
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 40,
    color: "white",
    fontWeight: 800,
  },
  headerContainer: {
    marginTop: "2%",
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
    fontWeight: "regular",
  },
  editIconContainer: {
    justifyContent: "center",
    marginTop: "20%",
  },
  buttonContainer: {
    width: "100%",
    bottom: "2%",
    paddingHorizontal: "8%",
  },
  myMembershipsField: {
    paddingVertical: 8,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 10,
  },
  myMembershipsText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: 600,
    justifyContent: "center",
    alignSelf: "center",
  },
  membershipField: {
    paddingVertical: 8,
    padding: "10%",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
  },
  membershipText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 1)",
  },
  membershipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  memberButton: {
    backgroundColor: "green",
  },
  informationContainer: {
    height: 350,
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: "white",
    borderRadius: 5,
  },

  background: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  orgEventures: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 15,
    margin: "3%",
    borderRadius: 5,
  },
});

export default OrganizationPage;
