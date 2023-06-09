import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  RefreshControl,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import OnlyEventItem from "../components/only-events-item";
import EventuresBackground from "../assets/images/eventures_background.png";

const OrganizationPage = () => {
  const route = useRoute();
  const orgId = route.params.orgId;
  const [orgBio, setOrgBio] = useState("");
  const [isMember, setIsMember] = useState("");
  const [hasRequestPending, setHasRequestPending] = useState("");
  const [student, setStudent] = useState("");
  const [orgName, setOrgName] = useState("");
  const [eventData, setEventData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrgData();
    fetchEventData();
    checkMembership();
    checkMembershipRequest();
  }, [student, isMember, hasRequestPending]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrgData();
    fetchEventData();
    checkMembership();
    checkMembershipRequest();
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
      setOrgBio(response.data.org_bio);
      setOrgName(response.data.org_name);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEventData = async () => {
    await fetchOrgData();
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

      setEventData(filteredEvents.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  // Checking if the user is a member of the organization
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

  // Checking if the user has sent a membership request to the organization
  const checkMembershipRequest = async () => {
    try {
      const student = await AsyncStorage.getItem("studentId");
      console.log('Student id: ' + student);

      if (student) {
        const accessToken = await AsyncStorage.getItem("accessToken");
        console.log(accessToken);
        const response = await API_BASE_URL.get(
          `/api/membership/request/${student}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const membershipRequestData = response.data;
        const isPendingRequest = membershipRequestData.find(
          (membershipRequest) => membershipRequest.organization === orgId
        );
        console.log("Pending: " + membershipRequestData);

        if (isPendingRequest) {
          setHasRequestPending(true);
        } else {
          setHasRequestPending(false);
        }
      } else {
        console.log("Have not recived student id!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function that sends a member request to the organization, but only if the student is not already a member and has no pending request
  const becomeMember = async () => {
    const body = {
      organization: orgId,
      student: student,
    };
    try {
      if (isMember == false && hasRequestPending == false) {
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
      }

      await checkMembershipRequest();

      if (isMember == false && hasRequestPending == true) {
        console.log("Student has a membership request pending");
      } else {
        console.log("Already a member");
      }
    } catch (error) {
      console.error(error);
    }
  };
 
  // Function that gives the button different looks and functionality depending on several parameters
  const renderButton = () => {
    if (isMember) {
      return (
        <Pressable style={styles.memberButton} disabled={true}>
          <Text style={styles.buttonText}>Member</Text>
        </Pressable>
      );
    } else if (hasRequestPending) {
      return (
        <Pressable style={styles.pendingButton} disabled={true}>
          <Text style={styles.buttonText}>Request Pending</Text>
        </Pressable>
      );
    } else {
      return (
        <Pressable style={styles.button} onPress={becomeMember}>
          <Text style={styles.buttonText}>Become Member</Text>
        </Pressable>
      );
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#BDE3FF", flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          progressBackgroundColor="white"
          progressViewOffset={-20}
        />
      }
    >
      <View style={styles.whiteBox}>
        <ImageBackground
          source={EventuresBackground}
          style={styles.imageBackground}
        >
          <Text style={styles.initials}>{route.params.orgName}</Text>
        </ImageBackground>
        <View style={styles.lowerWhiteBoxContainer}>
          <View style={styles.infotextContainer}>
            <Text style={styles.header}>{route.params.orgName}</Text>
            <Text style={styles.text}>{orgBio}</Text>
          </View>
        </View>
        {renderButton()}
      </View>

      <View style={styles.orgEventures}>
        <Text style={styles.eventuresText}>
          {" "}
          {route.params.orgName}s Eventures{" "}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        {eventData.map((item) => (
          <OnlyEventItem
            key={item.id.toString()}
            orgId={item.event_org}
            orgName={orgName}
            organizationInformation={item.organizationInformation}
            eventId={item.id}
            eventTitle={item.event_name}
            eventPic={item.event_pic}
            eventInformation={item.event_desc}
            location={item.event_location}
            date={item.event_date}
            time={item.event_time}
            price={item.event_price + " kr"}
            releaseDate={item.release_date}
            releaseTime={item.release_time}
            ticketsLeft={item.tickets_left}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  whiteBox: {
    height: 305,
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
  eventuresText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: 600,
    justifyContent: "center",
    alignSelf: "center",
  },
  imageBackground: {
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 40,
    color: "white",
    fontWeight: 800,
    textAlign: "center",
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
    width: "100%",
    height: 45,
    marginTop: 20,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "green",
  },
  pendingButton: {
    width: "100%",
    height: 45,
    marginTop: 20,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "grey",
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
    height: 30,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 15,
    margin: "3%",
    borderRadius: 5,
  },
});

export default OrganizationPage;
