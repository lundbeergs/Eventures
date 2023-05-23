
import { View, FlatList, RefreshControl} from "react-native";
import EventList from "../components/event-list";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '../axios.js';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePageStudent = () => {
  const [eventData, setEventData] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get(`/api/events/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const filteredEvents = response.data.filter(event =>
        membershipData.some(member => member.organization === event.event_org),
      );
      setEventData(filteredEvents);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrgData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await API_BASE_URL.get('/api/organizations/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOrgData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMemershipData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await API_BASE_URL.get('/api/memberships/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const membershipData = response.data.map((item) => ({
        organization: item.organization,
      }));
      setMembershipData(membershipData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMemershipData();
    fetchOrgData();
    fetchEventData();
  }, [] )

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEventData();
    setRefreshing(false);
  };

  return (
    <View style={{ backgroundColor: '#BDE3FF', flex: 1 }}>
      <FlatList
        data={[...eventData]}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<EventList eventData={eventData} orgData={orgData}/>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} progressBackgroundColor={'white'} progressViewOffset={-20}/>
      }
      />
    </View>
  );
};

export default HomePageStudent;
