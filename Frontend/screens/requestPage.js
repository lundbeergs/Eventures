import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../global-style";
import { SafeAreaView } from "react-native-safe-area-context";

const RequestPage = () => {
  const [organization, setOrganizationID] = useState("");
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getOrganizationProfile();

    if (organization !== "") {
      getRequests();
    }
  }, [organization]);

  const handleRefresh = () => {
    setRefreshing(true);
    getRequests();
    getOrganizationProfile();
    setRefreshing(false);
  };

  const getRequests = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get(
        `/api/membership/requests/${organization}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const requestData = response.data;
      if (requestData && requestData.length > 0) {
        const studentIds = requestData.map((item) => item.student);
        const uniqueStudentIds = [...new Set(studentIds)];

        const studentsResponse = await API_BASE_URL.get(`/api/students/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const studentsData = studentsResponse.data;
        const updatedStudents = studentsData.filter((student) =>
          uniqueStudentIds.includes(student.id)
        );

        setStudents(updatedStudents);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async (studentId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(accessToken);
      console.log(organization);
      console.log("viktigt:", studentId);
      const response = await API_BASE_URL.put(
        `/api/membership/requests/${organization}/${studentId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getOrganizationProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: userProfile } = response.data;
      console.log(userProfile);

      if (userProfile && userProfile.length > 0) {
        const { id } = userProfile[0];
        setOrganizationID(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRequest = async (studentId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(accessToken);
      console.log(organization);
      console.log("studentId:", studentId);
      const response = await API_BASE_URL.delete(
        `/api/membership/requests/${organization}/${studentId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentId)
      );
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

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressBackgroundColor="white"
            progressViewOffset={-20}
          />
        }
      >
        {students.map((student) => (
          <View style={styles.studentContainer} key={student.id}>
            <Text style={styles.studentName}>
              {capitalLetter(student.first_name)} {capitalLetter(student.last_name)}
            </Text>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => acceptRequest(student.id)}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="green"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => deleteRequest(student.id)}
            >
              <Ionicons name="close-circle-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  studentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "2%",
    marginHorizontal: "4%",
    backgroundColor: "white",
    padding: "2%",
    borderRadius: 4,
  },
  studentName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
});

export default RequestPage;
