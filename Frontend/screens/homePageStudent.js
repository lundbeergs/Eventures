import { View, Text, StyleSheet, FlatList } from "react-native";
import EventList from "../components/event-list";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '../axios.js';

const HomePageStudent = ({route}) => {
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData()
  }, [] )

  const fetchData = async () => {
    try {
      const response = await API_BASE_URL.get('api/organizations/');
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
