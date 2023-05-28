import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../global-style";
import { API_BASE_URL } from "../axios";
import PurpleButton from "../components/PurpleButton";

const MyProfilePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [profileData, setProfileData] = useState(null);
  const [orgData, setOrgData] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Check if the profile has been updated
    if (route.params?.isProfileUpdated) {
      // Fetch the updated profile data
      fetchData();
      // Reset the isProfileUpdated parameter
      navigation.setParams({ isProfileUpdated: false });
    }
  }, [route.params?.isProfileUpdated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchData()]);
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    navigation.navigate("EditStudentProfilePage", {
      profileData: {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        allergies: profileData.allergies,
        drinkpref: profileData.drinkpref,
      },
    });
  };

  const fetchData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");

      // Fetch profile data
      const profileResponse = await API_BASE_URL.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: userProfile } = profileResponse.data;

      if (userProfile && userProfile.length > 0) {
        setProfileData(userProfile[0]);
      }

      // Fetch organization data
      const orgResponse = await API_BASE_URL.get("/api/organizations/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: orgData } = orgResponse;

      setOrgData(orgData);
      console.log(orgData);

      // Fetch membership data
      const membershipResponse = await API_BASE_URL.get("/api/memberships/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: membershipData } = membershipResponse;

      setMyMemberships(membershipData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMembership = async (organizationId) => {
    try {
      console.log(organizationId);
      console.log(profileData.id);
      const accessToken = await AsyncStorage.getItem("accessToken");
      await API_BASE_URL.delete(
        `/api/membership/student/${organizationId}/${profileData.id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Membership deleted!");
      const updatedMemberships = myMemberships.filter(
        (membership) => membership.organization !== organizationId
      );
      setMyMemberships(updatedMemberships);
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

  const capitalLetter = (string) => {
    const words = string.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  if (!profileData) {
    // Render loading state or any other UI when profile data is not available
    return (
      <SafeAreaView style={GlobalStyles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const { first_name, last_name, allergies, drinkpref, id: id } = profileData;

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressBackgroundColor={"white"}
            progressViewOffset={-20}
          />
        }
      >
            <View style={styles.whiteBox}>
          <ImageBackground
            source={require("../assets/images/eventures_background.png")}
            style={styles.imageBackground}
          >
            <View style={styles.initialsContainer}>
              <View style={styles.initialsBackground}>
                <Text style={styles.initials}>
                  {first_name.charAt(0).toUpperCase()}.
                  {last_name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View></ImageBackground>
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={handleEditProfile}
            >
              <Ionicons name="create-outline" size={30} color="black" />
            </TouchableOpacity>
          
          <View style={styles.infotextContainer}>
            <Text style={styles.header}>
              {capitalLetter(first_name)} {capitalLetter(last_name)}
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              First name: {capitalLetter(first_name)}
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              Last name: {capitalLetter(last_name)}
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              Allergies: {capitalLetter(allergies)}
            </Text>
            <Text style={styles.text}>
              Drink preferences: {profileData.drinkpref}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ marginHorizontal: '4%' }}>
            <View style={styles.myMembershipsField}>
              <Text style={styles.myMembershipsText}>My Memberships</Text>
            </View>
            <ScrollView
            >
              {myMemberships.map((membership) => {
                const organization = orgData.find(
                  (org) => org.id === membership.organization
                );
                return (
                  <View
                    style={styles.membershipContainer}
                    key={membership.organization}
                  >
                    <Text style={styles.membershipsText}>
                      {organization.org_name}
                    </Text>
                    <TouchableOpacity
                      style={styles.iconContainer}
                      onPress={() => deleteMembership(membership.organization)}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.buttonContainer}>
            <PurpleButton onPress={logOutHandler} text="Log Out" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  editIconContainer: {
    position: "absolute",
    top: "91%",
    right: "5%",
    zIndex: 1,
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
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
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
  buttonContainer: {
    marginTop: "auto",
    marginBottom: "2%",
    width: "100%",
    paddingHorizontal: '4%',
  },
  myMembershipsField: {
    height: "20%",
    marginVertical: "2%",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 5,
  },
  myMembershipsText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: 600,
    justifyContent: "center",
    alignSelf: "center",
  },
  membershipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: '1%',
    backgroundColor: "white",
  },
  membershipsText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: 600,
    justifyContent: "center",
    alignSelf: "center",
    margin: "2%",
  },
  iconContainer: {
    paddingHorizontal: "4%",
  },
});

export default MyProfilePage;
