import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import SearchEventList from "../components/search-event-list";
import OrgList from "../components/org-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../axios.js";

const SearchPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [currentSelection, setCurrentSelection] = useState("events");
  const [searchQuery, setSearchQuery] = useState("");
  const [orgData, setOrgData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchOrgData();
    fetchEventData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, currentSelection, eventData, orgData]);

  const fetchOrgData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/organizations/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOrgData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEventData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await API_BASE_URL.get("/api/events/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setEventData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filterData = () => {
    if (currentSelection === "events" && eventData) {
      const filteredEvents = eventData.filter((event) =>
        event.event_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filteredEvents);
    } else if (currentSelection === "organizations" && orgData) {
      const filteredOrgs = orgData.filter((org) =>
        org.org_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filteredOrgs);
    }
  };

  return (
    <View style={{ backgroundColor: "#BDE3FF", flex: 1 }}>
      <View style={styles.topOfPage}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#B0B0B0" marginHorizontal={8} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              currentSelection === "events"
                ? "Search events..."
                : "Search organizations..."
            }
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={StyleSheet.compose(
              [
                styles.selectionButton,
                currentSelection === "events" && styles.activeSelectionButton,
              ],
              { paddingHorizontal: 40 }
            )}
            onPress={() => setCurrentSelection("events")}
          >
            <Text
              style={[
                styles.selectionButtonText,
                currentSelection === "events" &&
                  styles.activeSelectionButtonText,
              ]}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectionButton,
              currentSelection === "organizations" &&
                styles.activeSelectionButton,
            ]}
            onPress={() => setCurrentSelection("organizations")}
          >
            <Text
              style={[
                styles.selectionButtonText,
                currentSelection === "organizations" &&
                  styles.activeSelectionButtonText,
              ]}
            >
              Organizations
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.compArea}>
        {currentSelection
          === 'events' && (
            <FlatList
              data={[{ key: 'event' }]}
              renderItem={({ item }) => <SearchEventList data={filteredData}/>}
              keyExtractor={(item) => item.key}
            />
          )}
        {currentSelection === 'organizations' && (
          <FlatList
            data={[{ key: 'org' }]}
            renderItem={({ item }) => <OrgList data={filteredData} />}
            keyExtractor={(item) => item.key}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topOfPage: {
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    height: 40,
    width: "92%",
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000000",
  },
  compArea: {
    flex: 1,
  },
  selectionContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  selectionButton: {
    paddingHorizontal: 22,
    backgroundColor: "#BDE3FF",
    borderBottomColor: "black",
  },

  activeSelectionButton: {
    borderBottomWidth: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: "2%",
  },
});

export default SearchPage;
