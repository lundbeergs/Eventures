import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../global-style";
import { API_BASE_URL } from "../axios";
import PurpleButton from "../components/PurpleButton";
import OrgList from "../components/org-list";

const MyProfilePage = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [drinkpref, setDrinkPref] = useState([]);
  const [id, setId] = useState("");
  const route = useRoute();
  const initial_first_name = firstName.charAt(0).toUpperCase();
  const initial_last_name = lastName.charAt(0).toUpperCase();
  const [membership, setMembership] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [isMember, setIsMember] = useState(false);

  const MyMembershipHandler = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/memberships/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data: membershipData } = response;
      setMyMemberships(membershipData);
      fetchOrgData();
      console.log(membershipData);
    } catch (error) {
      console.error(error);
    }
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
        const { first_name, last_name, allergies, drinkpref, id } =
          userProfile[0];
        setFirstName(first_name);
        setLastName(last_name);
        setAllergies(allergies);
        setDrinkPref(drinkpref);
        setId(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
    MyMembershipHandler();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      // Check if the profile has been updated
      if (route.params?.isProfileUpdated) {
        // Fetch the updated profile data
        await getProfile();
      }
    };

    fetchProfile();
  }, [route.params?.isProfileUpdated]);

  const handleEditProfile = () => {
    navigation.navigate("EditStudentProfilePage");
  };

  const fetchOrgData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/organizations/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setOrgData(data); // Update the organization data here

      // Create a map of organization IDs to names
      const orgMap = {};
      data.forEach((org) => {
        orgMap[org.id] = org.org_name;
      });

      // Check if the user is a member of any organization
      const isMember = myMemberships.length > 0;
      setIsMember(isMember);

      // Update the membership data with organization names
      const updatedMemberships = myMemberships.map((membership) => ({
        ...membership,
        org_name: orgMap[membership.organization] || "Unknown Organization",
      }));
      setMyMemberships(updatedMemberships);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, [myMemberships.length]);

  const deleteMembership = async (organization) => {
    try {
      console.log(organization);
      console.log(id);
      const accessToken = await AsyncStorage.getItem("accessToken");

      // Remove the membership from the server
      await API_BASE_URL.delete(
        `/api/membership/student/${organization}/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedMemberships = myMemberships.filter(
        (membership) => membership.organization !== organization
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

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={styles.whiteBox}>
        <ImageBackground
          source={require("../assets/images/eventures_background.png")}
          style={styles.imageBackground}
        >
          <View style={styles.initialsContainer}>
            <View style={styles.initialsBackground}>
              <Text style={styles.initials}>
                {initial_first_name}.{initial_last_name}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.lowerWhiteBoxContainer}>
          <View style={styles.infotextContainer}>
            <Text style={styles.header}>
              {firstName} {lastName}
            </Text>
            <Text style={styles.text}>First name: {firstName}</Text>
            <Text style={styles.text}>Last name: {lastName}</Text>
            <Text style={styles.text}>Allergies: {allergies}</Text>
            <Text style={styles.text}>Drink preferences: {drinkpref}</Text>
          </View>
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ marginHorizontal: 15 }}>
          <View style={styles.myMembershipsField}>
            <Text style={styles.myMembershipsText}>My Memberships</Text>
          </View>
          <ScrollView>
            {myMemberships.length === 0 ? (
              <Text style={styles.myMembershipText}>You are not a member of any organization.</Text>
            ) : (
              myMemberships.map((membership) => (
                <View
                  style={styles.membershipContainer}
                  key={membership.organization}
                >
                  <Text style={styles.membershipText}>
                    {membership.org_name}
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
              ))
            )}
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <PurpleButton onPress={logOutHandler} text={"Log Out"}></PurpleButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  whiteBox: {
    height: "47%",
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
    paddingHorizontal: "4%",
  },
  myMembershipsField: {
    height: 40,
    marginVertical: "3%",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 5,
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
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
    padding: "2%",
  },
  membershipText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)",
    padding: "1%",
  },
  membershipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    height: 40,
    margin: "1%",
    backgroundColor: "white",
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
});

export default MyProfilePage;

/* 
<View style={styles.lowerWhiteBoxContainer}>
        <View style={styles.infotextContainer}>
          <Text style={styles.header}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.text}>First name: {firstName}</Text>
          <Text style={styles.text}>Last name: {lastName}</Text>
          <Text style={styles.text}>Allergies: {allergies}</Text>
        </View>
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={handleEditProfile}
        >
          <Ionicons name="create-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      */

//   <View style={styles.membershipField}>
//   {!isMember && (
//     <View>
//       <Text>You are not a member of any organization.</Text>
//     </View>
//   )}
//   {myMemberships.map((membership) => (
//     <View key={membership.id}>
//       <View style={styles.membershipContainer}>
//         <Text style={styles.membershipText}>
//           {membership.org_name}
//         </Text>
//         <TouchableOpacity
//           onPress={() =>
//             deleteMembership(
//               membership.organization,
//             )
//           }
//         >
//           <Ionicons
//             name="close-circle-outline"
//             size={30}
//             color="red"
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   ))}
// </View>
//   <FlatList
//   refreshControl={
//     <RefreshControl
//       refreshing={refreshing}
//       onRefresh={handleRefresh}
//       progressBackgroundColor={"white"}
//       progressViewOffset={-20}
//     />
//   }
// />
