import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import OrganizationEventComp from "../components/firstPageComp/OrganizationEventComp";
import eventures from "../assets/images/eventures.png";
import psychotech from "../assets/images/psychotech.jpg";
import stsKV from "../assets/images/stsKV.jpg";
import whiteCirkle from "../assets/images/whiteCirkle.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";


import destinationUnknown from "../assets/images/destinationUnknown.jpg";

const OrganizationPage = () => {
  const route = useRoute();
  const organization = route.params.organization;
  const [isMember, setIsMember] = useState("");
  const [student, setStudent] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkMembership();
  }, [isMember]);

  const handleRefresh = () => {
    setRefreshing(true);
    checkMembership();
    setRefreshing(false);
  };

  const checkMembership = async () => {
    try {
      setStudent(await AsyncStorage.getItem("studentId"));
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/memberships/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const membershipData = response.data;
      console.log(membershipData);
      console.log('org: '+organization);

      const isOrganizationMember = membershipData.find(
        (membership) => membership.organization === organization,
      );

      if (isOrganizationMember) {
        setIsMember(true);
      } else {
        setIsMember(false);
      }
      console.log(isMember);
      console.log("student " + student);
    } catch (error) {
      console.error(error);
    }
  };

  const becomeMember = async () => {
    const body = {
      organization: organization,
      student: student,
    };
    try {
      if (isMember == false) {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const response = await API_BASE_URL.post(
          `/api/membership/request/${organization}/${student}/`,
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

  return (
    <View style={{ backgroundColor: "#BDE3FF", flex: 1 }}>
      <ScrollView 
        onRefresh={handleRefresh}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9Bd35A", "#689F38"]}
            progressBackgroundColor="#fff"
          />
        }>
        <View style={styles.informationContainer}>
          <Image
            style={styles.orgProfilePic}
            source={route.params.orgProfilePic}
          />
          <Image style={styles.orgIconBackground} source={whiteCirkle} />
          <Image style={styles.orgIcon} source={route.params.orgIcon} />
          <Text
            style={{
              marginTop: "55%",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {route.params.organization}
          </Text>
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

          <Text style={{ marginTop: "5%", marginLeft: "5%" }}>
            {route.params.organizationInformation}
          </Text>
        </View>

        <View style={styles.orgEventures}>
          <Text style={{ textAlign: "center", fontSize: 17 }}>
            {" "}
            {route.params.organization}s eventures{" "}
          </Text>
        </View>

        <View>
          <ScrollView>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <OrganizationEventComp
                orgIcon={stsKV}
                eventTitle="Psychotech"
                eventPic={psychotech}
                organization="STS-klubbverk"
                location="V-dala"
                date="2023-05-12"
                price="450kr"
              />
              <OrganizationEventComp
                orgIcon={eventures}
                eventTitle="Destination unknown"
                eventPic={destinationUnknown}
                organization="STS-sektionen"
                location="Destination? Unknown"
                date="2023-10-27"
                price="1500kr"
              />
              <OrganizationEventComp
                orgIcon={eventures}
                eventTitle="It's OktoberfeSTS"
                organization="STS-klubbverk & I-klubbverk"
                location="Bridgens"
                date="2023-10-12"
                price="110kr"
              />
              <OrganizationEventComp
                orgIcon={eventures}
                eventTitle="It's OktoberfeSTS"
                eventPic={destinationUnknown}
                organization="STS-klubbverk & I-klubbverk"
                location="Bridgens"
                date="2023-10-12"
                price="110kr"
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topOfPage: {
    height: 30,
  },

  backArrow: {
    height: 25,
    width: 25,
    marginLeft: 15,
    marginBottom: 15,
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

  orgProfilePic: {
    height: 190,
    width: 340,
    marginTop: "3%",
    marginLeft: "3%",
    marginRight: "1.5%",
    zIndex: 1,
    position: "absolute",
  },

  orgIconBackground: {
    height: 100,
    width: 100,
    zIndex: 2,
    position: "absolute",
    top: "43%",
    left: "1.8%",
  },

  orgIcon: {
    height: 45,
    width: 45,
    borderRadius: 30,
    zIndex: 3,
    position: "absolute",
    top: "51.2%",
    left: "10%",
  },

  orgEventures: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginRight: 15,
    marginLeft: 15,
    margin: "3%",
    borderRadius: 5,
  },
});

export default OrganizationPage;

