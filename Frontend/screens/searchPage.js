import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchEventList from '../components/search-event-list';
import OrgList from '../components/org-list';

const SearchPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [currentSelection, setCurrentSelection] = useState('events');

  const [data, setData] = useState([])
  useEffect(() => {
    fetchOrgData()
  }, [] )


const fetchOrgData = async() => {
    const response = await fetch('http://130.243.237.33:8000/api/organizations/')
    const data = await response.json()
    setData(data)
}

useEffect(() => {
  fetchEventData();
}, []);

const fetchEventData = async() => {
  const response = await fetch('http://example.com/api/additional-data/');
  const data = await response.json();
  setAdditionalData(data);
};


  return (
    <View style={{ backgroundColor: '#BDE3FF', flex: 1 }}>
      <View style={styles.topOfPage}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#B0B0B0" marginLeft={8}/>
          <TextInput
            style={styles.searchInput}
            placeholder=" Find event or organization"
            placeholderTextColor="#B0B0B0"
            onChangeText={(text) => console.log(text)}
          />
        </View>
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={StyleSheet.compose(
              [styles.selectionButton, currentSelection === 'events' && styles.activeSelectionButton],
              { paddingHorizontal: 40}
            )}
            onPress={() => setCurrentSelection('events')}
          >
            <Text style={[styles.selectionButtonText, currentSelection === 'events' && styles.activeSelectionButtonText]}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectionButton, currentSelection === 'organizations' && styles.activeSelectionButton]}
            onPress={() => setCurrentSelection('organizations')}
          >
            <Text style={[styles.selectionButtonText, currentSelection === 'organizations' && styles.activeSelectionButtonText]}>Organizations</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.compArea}>

  {currentSelection === 'events' && (
    <FlatList
      data={[{key: 'event'}]}
      renderItem={({ item }) => <SearchEventList/>}
      keyExtractor={item => item.key}
    />
  )}
  {currentSelection === 'organizations' && (
    <FlatList
      data={[{key: 'org'}]}
      renderItem={({ item }) => <OrgList data={data}/>}
      keyExtractor={item => item.key}
    />
  )}
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  topOfPage: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 40,
    width: '94%'
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000000'
  },
  selectionContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  selectionButton: {
    paddingHorizontal: 22,
    backgroundColor: '#BDE3FF',
    borderBottomColor: 'black'
  },
  activeSelectionButton: {
    borderBottomWidth: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '2%',
  }
});

export default SearchPage;
