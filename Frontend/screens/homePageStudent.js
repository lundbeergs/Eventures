import { View, Text, StyleSheet, FlatList } from "react-native";
import EventList from "../components/event-list";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '../axios.js';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePageStudent = ({route}) => {
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData()
  }, [] )

  const fetchData = async () => {
    try {
      console.log('hej')
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(accessToken)
      console.log('hejsan')
      const response = await API_BASE_URL.get(`/api/events/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ backgroundColor: '#BDE3FF', flex: 1 }}>
      <FlatList
        data={[]}
        keyExtractor={(index) => index.toString()}
        ListHeaderComponent={<EventList data={data}/>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
})

export default HomePageStudent;
