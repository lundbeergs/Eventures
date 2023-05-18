import { View, Text, StyleSheet, FlatList, RefreshControl} from "react-native";
import EventList from "../components/event-list";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '../axios.js';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePageStudent = () => {
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    fetchData()
  }, [] )

  const fetchData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get(`/api/events/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  return (
    <View style={{ backgroundColor: '#BDE3FF', flex: 1 }}>
      <FlatList
        data={[data]}
        keyExtractor={(index) => index.toString()}
        ListHeaderComponent={<EventList data={data}/>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} progressBackgroundColor={'white'} progressViewOffset={-20}/>
      }
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
