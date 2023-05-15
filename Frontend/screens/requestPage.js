import { Text, View, ScrollView, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import PurpleButton from "../components/PurpleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios";

const RequestPage = () => {
  const [organization, setOrganizationID] = useState(" ");
  const [studentID, setStudentID] = useState([]);

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
        const updatedStudents = requestData.map((item) => item.student);
        const uniqueStudents = updatedStudents.filter((student) => !studentID.includes(student));
        setStudentID((prevStudents) => [...prevStudents, ...uniqueStudents]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async (thisStudent) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(accessToken);
      console.log(organization);
      console.log(thisStudent);
      const response = await API_BASE_URL.put(
        `/api/membership/requests/${organization}/${thisStudent}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setStudentID((prevStudents) => prevStudents.filter((student) => student !== thisStudent));

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

  useEffect(() => {
    getOrganizationProfile();

    if (organization !== " ") {
        getRequests();
      }
  }, [organization]);

  return (
    <View>
      
      {studentID.map((student, index) => (
        <Button key={index} title={student} onPress={() => acceptRequest(student)} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({});

export default RequestPage;
