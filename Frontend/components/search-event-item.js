import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const SearchEventItem = ({
  id,
  orgIcon,
  orgProfilePic,
  eventTitle,
  eventPic,
  eventInformation,
  organization,
  organizationInformation,
  location,
  date,
  price
}) => {
  const navigation = useNavigation();

  const goToEvent = () => {
    navigation.navigate('EventPage', {
      eventPic: eventPic,
      eventTitle: eventTitle,
      eventInformation: eventInformation,
      organization: organization,
      location: location,
      date: date,
      price: price
    });
    console.log(organization);
  };

  return (
    <TouchableOpacity onPress={goToEvent}>
      <View style={styles.eventContainer}>
        <View style={styles.eventInfo}>
          <Image style={styles.eventPic} source={eventPic} />
          <View style={styles.eventTextInfo}>
            <Text style={{ fontWeight: 'bold' }}>{eventTitle}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    flex: 2,
    margin: 15,
    width: '92%',
    height: 230,
  },

  eventInfo: {
    backgroundColor: 'white',
    borderRadius: 5,
    flex: 2,
    flexDirection: 'column'
  },

  eventPic: {
    height: 190,
    width: '94%',
    marginTop: '3%',
    marginLeft: '3%',
    marginBottom: '1%'
  },

  eventTextInfo: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    paddingHorizontal: '3%'
  }
});

export default SearchEventItem;
