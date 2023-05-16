import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const imagePaths = {
  101: require("../assets/1.png"),
  102: require("../assets/2.png"),
  103: require("../assets/3.png"),
  104: require("../assets/4.png"),
  105: require("../assets/5.png"),
  106: require("../assets/6.png"),
  107: require("../assets/7.png"),
  108: require("../assets/8.png"),
};

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
  price,
  ticketsLeft
}) => {
  const eventPicSource = imagePaths[eventPic];
  const navigation = useNavigation();

  const goToEvent = () => {
    navigation.navigate('EventPage', {
      organization: organization,
      eventPic: eventPic,
      eventTitle: eventTitle,
      eventInformation: eventInformation,
      organization: organization,
      location: location,
      date: date,
      price: price
    });
    console.log(organization + 'hej' + eventPic);
  };

  return (
    <TouchableOpacity onPress={goToEvent}>
      <View style={styles.eventContainer}>
        <View style={styles.eventInfo}>
          <Image style={styles.eventPic} source={eventPicSource} />
          <View style={styles.eventTextInfo}>
            <Text style={{ marginLeft: '3%' }}>{ticketsLeft}</Text>
            <Text style={{ marginRight: '12%', fontWeight: 'bold' }}>{eventTitle}</Text>
            <Text style={{ marginRight: '3%' }}>{price}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  }
});

export default SearchEventItem;
