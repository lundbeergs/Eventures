import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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

const EventItem = ({
  eventId,
  orgIcon,
  orgProfilePic,
  eventTitle,
  eventPic,
  eventInformation,
  orgName,
  orgId,
  organizationInformation,
  location,
  date,
  price,
  ticketsLeft,
}) => {
  const eventPicSource = imagePaths[eventPic];
  const navigation = useNavigation();

  const goToEvent = () => {
    navigation.navigate("EventPage", {
      orgName: orgName,
      orgId: orgId,
      eventId: eventId,
      eventPic: eventPic,
      eventTitle: eventTitle,
      eventInformation: eventInformation,
      location: location,
      date: date,
      price: price,
    });
  };

  const goToOrganization = () => {
    navigation.navigate("OrganizationPage", {
      orgId,
      orgName,
      orgIcon: orgIcon,
      orgProfilePic: orgProfilePic,
      organizationInformation: organizationInformation,
    });
  };

  return (
    <ScrollView>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={goToOrganization}>
          <View style={styles.organizationTitle}>
            <Text style={{ fontWeight: "bold" }}>{orgName}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToEvent}>
          <View style={styles.eventContainer}>
            <View style={styles.eventInfo}>
              <Image style={styles.eventPic} source={eventPicSource} />
              <View style={styles.eventTextInfo}>
                <Text style={{ marginLeft: "3%" }}>
                  {"Tickets: " + ticketsLeft}
                </Text>
                <Text style={{ marginRight: "12%", fontWeight: "bold" }}>
                  {eventTitle}
                </Text>
                <Text style={{ marginRight: "3%" }}>{price}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    height: "auto",
    marginBottom: 10,
    marginHorizontal: 15,
  },

  eventContainer: {
    height: "auto",
    marginBottom: 15,
  },
  organizationTitle: {
    justifyContent: "center",
    alignSelf: "center",
    margin: "2%",
  },

  overhead: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventInfo: {
    backgroundColor: "white",
    borderRadius: 5,
    flex: 2,
    flexDirection: "column",
  },

  orgIcon: {
    height: 30,
    width: 30,
    borderRadius: 30,
  },

  eventTextInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  eventPic: {
    height: 190,
    width: "94%",
    marginTop: "3%",
    marginLeft: "3%",
    marginBottom: "1%",
  },
});

export default EventItem;

/*import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

const EventItem = ({
  eventId,
  orgIcon,
  orgProfilePic,
  eventTitle,
  eventPic,
  eventInformation,
  organization,
  organizationInformation,
  location,
  date,
  price,
  ticketsLeft,
}) => {
  const eventPicSource = imagePaths[eventPic];
  const navigation = useNavigation();
  const onPressHandler = () => {
    navigation.navigate("OrganizationPage", {
      organization: organization,
      orgIcon: orgIcon,
      orgProfilePic: orgProfilePic,
      organizationInformation: organizationInformation,
    });
  };

  const onPressHandler2 = () => {
    navigation.navigate("EventPage", {
      eventId: eventId,
      eventPic: eventPic,
      eventTitle: eventTitle,
      eventInformation: eventInformation,
      organization: organization,
      location: location,
      date: date,
      price: price,
    });
  };

  return (
    <ScrollView>
      <View style={styles.eventContainer}>
        <TouchableOpacity onPress={onPressHandler}>
          <View style={styles.overhead}>
            <Image style={styles.orgIcon} source={orgIcon} />
            <View style={styles.titleAndLocation}>
              <Text style={{ fontWeight: "bold" }}>{organization}</Text>
              <Text>{location}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressHandler2}>
          <View style={styles.eventInfo}>
            <View>
              <Image style={styles.eventPic} source={eventPic} />
            </View>
            <View>
              <View style={styles.eventTextInfo}>
                <Text style={{ marginLeft: "3%" }}>{date}</Text>
                <Text style={{ marginRight: "12%", fontWeight: "bold" }}>
                  {eventTitle}
                </Text>
                <Text style={{ marginRight: "3%" }}>{price}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    height: 275,
    marginBottom: 30,
    marginRight: 15,
    marginLeft: 15,
  },

  overhead: {
    flexDirection: "row",
    alignItems: "center",
  },

  titleAndLocation: {
    flex: 1,
    marginLeft: 10,
  },

  eventInfo: {
    backgroundColor: "white",
    marginTop: "1%",
    borderRadius: 5,
  },

  orgIcon: {
    height: 30,
    width: 30,
    borderRadius: 30,
  },

  eventPic: {
    height: 190,
    width: 340,
    margin: "3%",
    backgroundColor: "white",
  },

  eventTextInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default EventItem;*/
